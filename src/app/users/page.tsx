import { getAllUsers } from '@/controllers/userController';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <main className="min-h-screen px-6 py-8">
      <h1 className="mb-4 text-2xl font-bold">Users (MVC Example)</h1>
      {users.length === 0 ? (
        <p className="text-sm text-gray-500">
          No users found. Insert some rows into the `User` table in your PostgreSQL database to see them listed here.
        </p>
      ) : (
        <ul className="space-y-2">
          {users.map((user: any) => (
            <li
              key={user.id}
              className="rounded border border-gray-200 p-3 text-sm"
            >
              <div className="font-medium">{user.email}</div>
              {user.name && (
                <div className="text-gray-600">
                  Name: <span className="font-normal">{user.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

