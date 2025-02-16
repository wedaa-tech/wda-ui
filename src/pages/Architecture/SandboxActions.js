import { useState, useEffect, useRef } from 'react';
import { IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { RepeatIcon, AddIcon, ArrowForwardIcon } from '@chakra-ui/icons';

/**
 * Props:
 *   data: { project_id: string, ... }
 *   initialized: boolean  (whether Keycloak is initialized)
 *   keycloak: object      (Keycloak instance)
 */
const SandboxActions = ({ data, initialized, keycloak }) => {
    const [isCreatingSandbox, setIsCreatingSandbox] = useState(false);
    const [sandboxUrl, setSandboxUrl] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [sandboxState, setSandboxState] = useState("loading");
    const [showReconnect, setShowReconnect] = useState(false);

    const toast = useToast();
    const wsRef = useRef(null);
    const fetchIntervalRef = useRef(null);

    /**
     * Fetch the sandbox status from the server (Redis/Mongo).
     * This runs immediately on mount and every 30 seconds.
     */
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const resp = await fetch(`${process.env.REACT_APP_SANDBOX_BASE_URL}/sandbox/${data.project_id}/status`);
                const result = await resp.json();

                console.log("Sandbox Status:", result);

                // Possible statuses: "running", "exited", "expired", "initialize", "error"
                if (result.status === "running") {
                    setSandboxState("start");      // show "start" icon
                    setSandboxUrl(result.url);
                } else if (result.status === "expired" || result.status === "exited") {
                    setSandboxState("reconnect");  // show "reconnect" icon
                    setSandboxUrl(null);
                } else {
                    // "initialize", "error", or "notfound"
                    setSandboxState("initialize"); // show "initialize" icon
                    setSandboxUrl(null);
                }
            } catch (error) {
                console.error("Error fetching sandbox status:", error);
                // Fallback to "initialize" if there's an error
                setSandboxState("initialize");
            }
        };

        // Fetch when component mounts
        fetchStatus();

        // Fetch status every 30s
        fetchIntervalRef.current = setInterval(fetchStatus, 30000);

        // Cleanup the interval on unmount
        return () => clearInterval(fetchIntervalRef.current);
    }, [data.project_id]);

    /**
     * WebSocket connection to keep container alive
     * and detect disconnections.
     */
    useEffect(() => {
        const connectWebSocket = () => {
            if (wsRef.current?.readyState === WebSocket.OPEN) return;

            wsRef.current = new WebSocket("ws://localhost:8765");

            wsRef.current.onopen = () => {
                console.log("WebSocket connected");
                setIsConnected(true);
                setShowReconnect(false);
            };

            wsRef.current.onclose = () => {
                console.log("WebSocket disconnected, retrying in 5 seconds...");
                setIsConnected(false);
                setShowReconnect(true);
                setTimeout(connectWebSocket, 10000); // retry
            };

            wsRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setIsConnected(false);
                setShowReconnect(true);
            };
        };

        connectWebSocket();

        // Send a "ping" every 30 seconds
        const heartbeatInterval = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send("ping");
            }
        }, 30000);

        // Cleanup
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            clearInterval(heartbeatInterval);
        };
    }, []);

    /**
     * Create or Reconnect the sandbox on button click.
     */
    const handleSandboxClick = async (e) => {
        e.stopPropagation();

        // If we already have a URL and the container is "running" (start), just open it
        if (sandboxUrl && sandboxState === "start") {
            window.open(sandboxUrl, '_blank');
            return;
        }

        // If we're already doing something, prevent double-click
        if (isCreatingSandbox) return;

        setIsCreatingSandbox(true);
        setSandboxUrl(null);

        try {
            const userId = keycloak?.tokenParsed?.sub || "unknown-user-id";
            const headers = {
                'Content-Type': 'application/json',
            };
            if (initialized && keycloak?.token) {
                headers.Authorization = `Bearer ${keycloak.token}`;
            }

            let endpoint;
            let method;
            let actionMessage;
            let successMessage;

            // Decide if we're reconnecting or initializing
            if (sandboxState === "reconnect") {
                endpoint = `${process.env.REACT_APP_SANDBOX_BASE_URL}/sandbox/${data.project_id}/reconnect`;
                method = 'PUT';
                actionMessage = "Reconnecting Sandbox...";
                successMessage = "Sandbox Reconnected!";
            } else {
                // "initialize" or "error"
                endpoint = `${process.env.REACT_APP_SANDBOX_BASE_URL}/sandbox/${data.project_id}/create-with-code`;
                method = 'POST';
                actionMessage = "Creating Sandbox...";
                successMessage = "Sandbox Ready!";
            }

            // Show toast to indicate action
            toast({
                title: actionMessage,
                description: "Please wait while your sandbox is being prepared.",
                status: "info",
                duration: 4000,
                variant: "left-accent",
                isClosable: true,
            });

            // (Optional) small wait for UX
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Make the API call
            const resp = await fetch(endpoint, {
                method,
                headers,
                body: JSON.stringify({
                    user_id: userId,
                    project_id: data.project_id,
                    data,
                }),
            });

            if (!resp.ok) {
                throw new Error(`Failed to ${method === 'POST' ? 'create' : 'reconnect'} sandbox: ${resp.status}`);
            }

            const result = await resp.json();

            if (!result?.url || result.url === 'http://0.0.0.0:None/') {
                throw new Error("Invalid sandbox URL received.");
            }

            // If it worked, we have a fresh container
            setSandboxUrl(result.url);
            setSandboxState("start");

            toast({
                title: successMessage,
                description: "Click the same button again to open the sandbox.",
                status: "success",
                duration: 3000,
                variant: "left-accent",
                isClosable: true,
            });

        } catch (err) {
            console.error('Error opening/reconnecting sandbox:', err);
            toast({
                title: "Sandbox Error",
                description: err.message || "Something went wrong.",
                status: "error",
                duration: 4000,
                variant: "left-accent",
                isClosable: true,
            });
        } finally {
            setIsCreatingSandbox(false);
        }
    };

    /**
     * Choose the icon based on our local sandboxState:
     *  - "reconnect" => <RepeatIcon />
     *  - "start"     => <ArrowForwardIcon />
     *  - otherwise   => <AddIcon />
     */
    const getIcon = () => {
        if (sandboxState === "loading") return null;
        switch (sandboxState) {
            case "reconnect":
                return <RepeatIcon boxSize={5} />;
            case "start":
                return <ArrowForwardIcon boxSize={5} />;
            default:
                // "initialize" or "error"
                return <AddIcon boxSize={5} />;
        }
    };

    return (
        <>
            {sandboxState !== "loading" && (
                <Tooltip
                    label={
                        sandboxState === "reconnect"
                            ? "Reconnect Sandbox"
                            : sandboxState === "start"
                                ? "Open Sandbox"
                                : "Initialize Sandbox"
                    }
                    placement="top"
                    color="white"
                    borderRadius="md"
                    fontSize="sm"
                >
                    <IconButton
                        isDisabled={isCreatingSandbox}
                        top="5%"
                        size="md"
                        right="47%"
                        variant="outline"
                        colorScheme={
                            sandboxState === "reconnect"
                                ? "red"
                                : sandboxState === "start"
                                    ? "blue"
                                    : "blackAlpha"
                        }
                        className="prototype-icons"
                        aria-label="Sandbox Action"
                        position="absolute"
                        zIndex={99}
                        icon={getIcon()}
                        onClick={handleSandboxClick}
                    />
                </Tooltip>
            )}
        </>
    );
};

export default SandboxActions;
