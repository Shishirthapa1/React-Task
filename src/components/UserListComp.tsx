import React, { useState, useMemo, useCallback } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
    department: string;
    lastLogin: string;
};

type Department = {
    id: string;
    name: string;
};

type UserCardProps = {
    user: User;
    onClick: () => void;
    department?: Department;
};

const UserCard = React.memo(({ user, onClick, department }: UserCardProps) => {
    const lastLoginDate = useMemo(() => new Date(user.lastLogin), [user.lastLogin]);
    const isActive = useMemo(() => Date.now() - lastLoginDate.getTime() < 30 * 24 * 60 * 60 * 1000, [lastLoginDate]);

    return (
        <div
            onClick={onClick}
            style={{
                border: '1px solid #ccc',
                padding: '10px',
                margin: '5px',
                backgroundColor: isActive ? '#e8f5e8' : '#f5f5f5',
            }}
        >
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Department: {department?.name}</p>
            <p>Last Login: {lastLoginDate.toLocaleDateString()}</p>
            <span>{isActive ? 'Active' : 'Inactive'}</span>
        </div>
    );
});

type UserListProps = {
    users: User[];
    departments: Department[];
    onUserSelect: (user: User) => void;
};

const UserListComp: React.FC<UserListProps> = ({ users, departments, onUserSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const departmentMap = useMemo(
        () => new Map(departments.map((d) => [d.id, d])),
        [departments]
    );

    const sortedUsers = useMemo(() => {
        return users
            .filter((user) => {
                const matchesSearch =
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesDepartment =
                    selectedDepartment === 'all' || user.department === selectedDepartment;
                return matchesSearch && matchesDepartment;
            })
            .sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
    }, [users, searchTerm, selectedDepartment]);

    const handleUserClick = useCallback(
        (user: User) => () => onUserSelect(user),
        [onUserSelect]
    );

    return (
        <div>
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
            />

            <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
            >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                        {dept.name}
                    </option>
                ))}
            </select>

            <div>
                {sortedUsers.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onClick={handleUserClick(user)}
                        department={departmentMap.get(user.department)}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserListComp;
