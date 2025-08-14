import { Profiler } from 'react';
import UserListComp from '../components/UserListComp';

// Example mock data
const users = [
    { id: '1', name: 'Shishir Thapa', department: 'Engineering', email: 'shishirthapa@example.com', lastLogin: '2024-06-01' },
    { id: '2', name: 'Ram Prasad', department: 'Marketing', email: 'ramprasad@example.com', lastLogin: '2024-06-02' },
];


const departments = [
    { id: '1', name: 'Engineering' },
    { id: '2', name: 'Marketing' },
    { id: '3', name: 'Finance' }
];

const onUserSelect = (user: typeof users[0]) => {
    console.log('Selected user:', user);
};

const UserList = () => {
    return (
        <div>
            <Profiler
                id="UserList"
                onRender={(id, phase, actualDuration) => {
                    console.log(`${id} (${phase}) took ${actualDuration}ms`);
                }}
            >
                <UserListComp
                    users={users}
                    departments={departments}
                    onUserSelect={onUserSelect}
                />
            </Profiler>
        </div>
    );
};

export default UserList;
