// NotificationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { initialized, keycloak } = useKeycloak();

    const fetchNotifications = async () => {
        try {
           
            const notificationUrl = process.env.REACT_APP_NOTIFICATION_SERVICE_URL+'/api/notification';
            await fetch(notificationUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: initialized ? `Bearer ${keycloak?.token}` : undefined,
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data =>{ 
                console.log('Notification API Response:', data);
                if(data?.notifications){
                setNotifications(data.notifications);
                }
                else {setNotifications([])};
            })
            .catch(error => console.error('Error fetching notification:', error));
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        if (initialized && keycloak?.authenticated) {
        fetchNotifications();
        }
    }, [initialized, keycloak?.realmAccess?.roles, keycloak?.token]);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
