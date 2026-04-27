import { useAuthStore } from '../../stores/authStore';
import { User, Mail, Phone, Shield } from 'lucide-react';

export default function Perfil() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.nombre} {user?.apellido}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Mail className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Shield className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-xs text-gray-500">Rol</p>
              <p className="font-medium capitalize">{user?.roles?.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
