import { useAuthStore } from '../store/useAuthStore.js';

const Main = () => {
  const { authUser, onlineUsers } = useAuthStore();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-xl font-semibold mb-4">
        Welcome, {authUser?.fullName} ✅
      </h1>

      <div className="mt-4">
        <p className="text-zinc-400 text-sm mb-2">
          Online users ({onlineUsers.length}):
        </p>
        <pre className="text-green-400 text-xs bg-zinc-900 p-4 rounded-lg">
          {JSON.stringify(onlineUsers, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Main;