import { useState, useEffect } from 'react';
import { IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { AddIcon, ArrowForwardIcon } from '@chakra-ui/icons';

/**
 * Props:
 *   data: { project_id: string, ... }
 *   initialized: boolean  (whether Keycloak is initialized)
 *   keycloak: object      (Keycloak instance)
 */
const SandboxActions = ({ data, initialized, keycloak }) => {
    const [isCreatingSandbox, setIsCreatingSandbox] = useState(false);
    const [codeServerUrl, setCodeServerUrl] = useState(null);
    const toast = useToast();

    const handleSandboxClick = async (e) => {
        e.stopPropagation();

        // If we already have a code server URL, just open it
        if (codeServerUrl) {
            window.open(codeServerUrl, '_blank');
            return;
        }

        if (isCreatingSandbox) return;
        setIsCreatingSandbox(true);
        setCodeServerUrl(null);

        const userId = keycloak?.tokenParsed?.sub || "test-user";
        const username = keycloak?.tokenParsed?.preferred_username || undefined;
        const projectId = data.project_id || "test-project";
        const token = keycloak?.token;

        try {
            // The project ZIP URL (should be accessible with the provided token)
            const projectZipUrl = `${process.env.REACT_APP_API_BASE_URL}/api/download/${projectId}`;

            const endpoint = `${process.env.REACT_APP_SANDBOX_BASE_URL}/environments/from-url`;
            const actionMessage = "Starting Remote Environment...";
            const successMessage = "Remote Environment Ready!";

            toast({
                title: actionMessage,
                description: "Please wait while your environment is being prepared.",
                status: "info",
                duration: 4000,
                variant: "left-accent",
                isClosable: true,
            });

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Prepare the payload as per the API spec
            const payload = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                project_id: projectId,
                project_zip_url: projectZipUrl,
                user_id: userId,
                mount_type: "volume",
            };
            if (username) payload.username = username;

            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!resp.ok) {
                let errorText;
                try {
                    errorText = await resp.text();
                } catch (e) {
                    errorText = '<Could not parse error body>';
                }
                console.error('Failed to start remote environment:', resp.status, errorText);
                throw new Error(`Failed to start remote environment: ${resp.status} - ${errorText}`);
            }

            const result = await resp.json();

            if (!result?.code_server_url) {
                throw new Error("Invalid code_server_url received.");
            }

            setCodeServerUrl(result.code_server_url);

            toast({
                title: successMessage,
                description: "Click the same button again to open the code server.",
                status: "success",
                duration: 4000,
                variant: "left-accent",
                isClosable: true,
            });
        } catch (err) {
            console.error('Error starting remote environment:', err);
            
            // If it's a container name conflict, try to find existing environment
            if (err.message.includes('container name') && err.message.includes('already in use')) {
                console.log('Container name conflict detected, checking for existing environment...');
                try {
                    const userId = keycloak?.tokenParsed?.sub;
                    const token = keycloak?.token;
                    const resp = await fetch(`${process.env.REACT_APP_SANDBOX_BASE_URL}/environments/user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (resp.ok) {
                        const result = await resp.json();
                        const env = result.environments?.find(e => e.project_id === projectId && (e.domain || e.local_domain));
                        if (env && (env.domain || env.local_domain)) {
                            // Construct the code server URL from domain
                            const codeServerUrl = `http://${env.domain || env.local_domain}`;
                            setCodeServerUrl(codeServerUrl);
                            toast({
                                title: "Environment Already Running",
                                description: "Found your existing environment. Click the arrow to open it.",
                                status: "success",
                                duration: 4000,
                                variant: "left-accent",
                                isClosable: true,
                            });
                            return; // Exit early, don't show error
                        }
                    }
                } catch (recheckErr) {
                    console.error('Error rechecking for existing environment:', recheckErr);
                }
            }
            
            toast({
                title: "Environment Error",
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

    useEffect(() => {
        async function checkExistingSandbox() {
            if (!initialized || !keycloak?.tokenParsed?.sub || !keycloak?.token || !data?.project_id) return;
            const userId = keycloak.tokenParsed.sub;
            const token = keycloak.token;
            const projectId = data.project_id;
            try {
                const resp = await fetch(`${process.env.REACT_APP_SANDBOX_BASE_URL}/environments/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (resp.ok) {
                    const result = await resp.json();
                    console.log('Existing sandboxes check:', result);
                    // result.environments is an array
                    // Check for any environment matching this project
                    const env = result.environments?.find(e => e.project_id === projectId && (e.domain || e.local_domain));
                    console.log('Found matching environment:', env);
                    if (env && (env.domain || env.local_domain)) {
                        // Construct the code server URL from domain
                        const codeServerUrl = `https://${env.domain || env.local_domain}`;
                        setCodeServerUrl(codeServerUrl);
                        console.log('Set existing codeServerUrl:', codeServerUrl);
                    }
                }
            } catch (err) {
                // Optionally handle error
                console.error('Error checking existing sandbox:', err);
            }
        }
        checkExistingSandbox();
    }, [initialized, keycloak, data?.project_id]);

    return (
        <Tooltip label={codeServerUrl ? "Open Code Server" : "Start Remote Environment"} placement="top" color="white" borderRadius="md" fontSize="sm">
            <IconButton
                isDisabled={isCreatingSandbox}
                top="5%"
                size="md"
                right="47%"
                variant="outline"
                colorScheme={codeServerUrl ? "blue" : "blackAlpha"}
                className="prototype-icons"
                aria-label="Sandbox Action"
                position="absolute"
                zIndex={99}
                icon={codeServerUrl ? <ArrowForwardIcon boxSize={5} /> : <AddIcon boxSize={5} />}
                onClick={handleSandboxClick}
            />
        </Tooltip>
    );
};

export default SandboxActions;
