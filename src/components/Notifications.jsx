import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";



const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 


  const url = process.env.REACT_APP_API_URL

  //for testing 
  // localStorage.removeItem("handledNotifications");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchNotifications(userData.users_id);
    }
  }, []);

  const fetchNotifications = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(url + `/notification/users/${userId}`);
      if (response.status === 200) {

        const handledNotifications = JSON.parse(localStorage.getItem("handledNotifications")) || [];
        
        const newNotifications = response.data.filter(
          (notif) => !handledNotifications.includes(notif.notification_id)
        );
        
        setNotifications(newNotifications);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (error) {
      setError("Error fetching notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (groupId, groupmemberId, action, notificationId) => {
    if (!user) return;
    const groupmemberStatus = action === "accept" ? "active" : "inactive";

    try {
      const response = await axios.put(
        url + `/notification/group_id/${groupId}/requests/${groupmemberId}`,
        {
          groupmember_status: groupmemberStatus,
          users_id: user.users_id, 
        }
      );

      if (response.status === 200) {
        setSuccessMessage(`Request ${action}ed successfully!`);

        setNotifications((prev) =>
          prev.filter((notif) => notif.notification_id !== notificationId)
        );

        const handledNotifications = JSON.parse(localStorage.getItem("handledNotifications")) || [];
        handledNotifications.push(notificationId);
        localStorage.setItem("handledNotifications", JSON.stringify(handledNotifications));

        setTimeout(() => {
          setSuccessMessage("");
        }, 2000); 
      }
    } catch (err) {
      console.error(`Failed to ${action} request:`, err.message);
    }
  };

  const ComfireMessage = (action, notificationId) => {
    if (!user) return;

    try {
      if (action === "confirm") {
        setNotifications((prev) =>
          prev.filter((notif) => notif.notification_id !== notificationId)
        );

        const handledNotifications = JSON.parse(localStorage.getItem("handledNotifications")) || [];
        handledNotifications.push(notificationId);
        localStorage.setItem("handledNotifications", JSON.stringify(handledNotifications));
      }
    } catch (err) {
      console.error(`Failed to ${action} request:`, err.message);
    }
  };
  
  return (
    <div className="page-container">
    <div className="notifications-page-container">
      <div className="notifications-container">
        <h1>Notifications</h1>
        <div className="notifications-card-container">
          {loading ? (
            <p>Loading notifications...</p>
          ) : error ? (
            <p>{error}</p>
          ) : notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notif) => {
              return (
                <div className="notifications-card" key={notif.notification_id}>
                  <p className="notifications-message">{notif.notification_message}</p>
                  <div className="notifications-button-group">
                    {notif.notification_type === "invitation" ? (
                      <>
                        <button
                      onClick={() =>
                        handleAction(notif.notification_group_id, notif.notification_groupmember_id, "accept", notif.notification_id)
                      }
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleAction(notif.notification_group_id, notif.notification_groupmember_id, "reject", notif.notification_id)
                      }
                    >
                      Reject
                    </button>
                      </>
                    ) : notif.notification_type === "status_change" ? (
                      <button
                        onClick={() =>
                          ComfireMessage("confirm", notif.notification_id)
                        }
                      >
                        Confirm
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Notifications;
