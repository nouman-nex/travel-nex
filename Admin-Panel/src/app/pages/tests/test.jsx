import DataTable from '@app/_components/table/table'
import { Box, Input, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


export default function Test() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchedText, setSearchedText] = useState("")

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get("https://jsonplaceholder.typicode.com/users")
            setUsers(res.data)
            setFilteredUsers(res.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [])

    const columns = [
        {
            field: "email",
            label: "Email",
            exportValue: (row) => row.email,
            renderCell: (row) => (
                <Typography variant="body2" fontWeight="medium">
                    {row.email}
                </Typography>
            ),
        },
        {
            field: "name",
            label: "Name",
            exportValue: (row) => row.name,
            renderCell: (row) => (
                <Typography variant="body2" fontWeight="medium">
                    {row.name}
                </Typography>
            ),
        },
        {
            field: "username",
            label: "user name",
            exportValue: (row) => row.username,
            renderCell: (row) => (
                <Typography variant="body2" fontWeight="medium">
                    {row.name}
                </Typography>
            ),
        },
    ];

    useEffect(() => {
        const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchedText))
        setFilteredUsers(filteredUsers)
    }, [searchedText])

    return (
        <div>
            <Box sx={{ marginTop: 3, marginBottom: 3 }}>
                <Input placeholder='Search By name' onChange={(e) => { setSearchedText(e.target.value) }} />
            </Box>
            <DataTable
                data={filteredUsers}
                columns={columns}
                title={"Users"}
                loading={loading}
            />
        </div>
    )
}
