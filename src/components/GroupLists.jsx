import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GroupLists.scss";

function GroupLists() {
    const navigate = useNavigate();
    const [Groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/groups`);
                setGroups(response.data);
                
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchGroups();
    }, []);

    return (
        <div className="group-list-item">
            <div className="title">
                <h1>Groups</h1>
                <div
                    className="creategroup-button"
                    onClick={() => {
                        const user = sessionStorage.getItem("user");
                        if (user) {
                            navigate("/CreateGroup");
                        } else {
                            navigate("/login");
                        }
                    }}
                >
                 <i className="fa-solid fa-plus"></i>   Create a new group! 
                </div>
            </div>
            <div className="group-list-grid">
                {Groups.map((group) => (
                    <div
                        key={group.group_id}
                        className="groupList-card"
                        onClick={() => navigate(`/group/${group.group_id}`)}
                    >
                        <div className="groupList-card-title">
                            <h3>{group.group_name}</h3>
                        </div>
                        <div className="subscription">
                            <p>{group.group_introduction}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroupLists;

