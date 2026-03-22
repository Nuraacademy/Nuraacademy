import { getAllUsers } from '@/controllers/userController';
import { requirePermission } from '@/lib/rbac';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  await requirePermission('User', 'VIEW_SEARCH_USER');
  const users = await getAllUsers();

  return (
    <main className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Users', href: '#' },
        ]}
      />

      <div className="bg-[#1C3A37] rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-medium font-merriweather">User Directory</h1>
        <p className="text-gray-300 text-sm mt-2 opacity-80">Manage and view all registered members</p>
      </div>

      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-white/50">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 italic">No users found in the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user: any) => (
              <div
                key={user.id}
                className="group p-6 rounded-xl border-2 border-gray-50 hover:border-[#DAEE49] transition-all duration-300 bg-white"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F9F9EE] flex items-center justify-center text-[#1C3A37] font-medium">
                    {(user.name || user.username)[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-medium text-[#1C3A37] truncate">{user.name || user.username}</span>
                    <span className="text-xs text-gray-400">@{user.username}</span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Email</span>
                    <span className="text-xs font-semibold text-[#1C3A37] truncate">{user.email}</span>
                  </div>
                </div>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="block text-center py-2.5 rounded-xl bg-gray-50 text-[#1C3A37] text-xs font-medium hover:bg-[#DAEE49] transition-colors"
                >
                  View Full Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

