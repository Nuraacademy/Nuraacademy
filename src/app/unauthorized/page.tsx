import Link from "next/link";

export default async function UnauthorizedPage({
    searchParams,
}: {
    searchParams: Promise<{ needed?: string | string[] }>
}) {
    const params = await searchParams;
    // If the parameter is passed multiple times, just grab the first one
    const neededParam = Array.isArray(params.needed) 
        ? params.needed[0] 
        : params.needed;
    
    // Attempt decoding in case they passed raw URI string
    const neededPermission = neededParam ? decodeURIComponent(neededParam) : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9EE] p-4">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 max-w-md w-full text-center space-y-4">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#1C3A37]">Access Denied</h1>
                <p className="text-gray-500 text-sm">
                    You do not have the required role or permissions to view this secure page or perform this action.
                </p>
                {neededPermission && (
                    <div className="mt-6 p-4 bg-red-50/50 rounded-2xl border border-red-100 text-left">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">Missing Permission</span>
                        <code className="text-red-700 bg-red-100/50 px-2 py-1 rounded font-mono text-sm break-all font-semibold block w-fit">
                            {neededPermission}
                        </code>
                    </div>
                )}
                <div className="pt-6">
                    <Link href="/" className="inline-block bg-[#D9F55C] hover:bg-[#c6e350] text-[#1C3A37] px-8 py-3 rounded-2xl text-sm font-bold shadow-sm transition-colors active:scale-95">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
