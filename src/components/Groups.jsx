import "./Groups.css"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const url = process.env.REACT_APP_API_URL

function Groups() {
    const navigate = useNavigate()
    const [groups, setGroups] = useState([])
    
    // fetch groupdata from database
    useEffect(() => {
        axios.get(url + "/groups")
            .then(response => {
            
            setGroups(response.data);
            }).catch(error => {
            alert(error.response.data.error ? error.response.data.error : error)
            })
        }, [])

    
    function handleGroupClick(group) {
        return;
    }

    function handleCreateGroupClick() {
        navigate("/groups/create")
    }
    
    return (
        <div class="group-list">
            <ul>
                {
                groups.map( group => (
                    <li key={group.group_id} onClick={() => handleGroupClick(group)}>
                        <h3>{group.group_name}</h3>
                    </li>
                ))
                }
            </ul>
            <div class ="button">
                <button type="button" onClick={ handleCreateGroupClick }>Create group</button> 
            </div>
        </div>
    )

}

export default Groups;