import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

const registroSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  password: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Debe tener mayúscula').regex(/[0-9]/, 'Debe tener número'),
  confirmar_password: z.string(),
}).refine((d) => d.password === d.confirmar_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar_password'],
});
type RegistroForm = z.infer<typeof registroSchema>;

export default function Registro() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegistroForm>({
    resolver: zodResolver(registroSchema),
  });

  const onSubmit = async (data: RegistroForm) => {
    setLoading(true);
    try {
      await authService.registro(data);
      toast.success('¡Registro exitoso! Bienvenido a Mi Tienda');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Crear Cuenta</h1>
          <p className="text-gray-500 text-sm mt-2">Únete a nuestra tienda</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input {...register('nombre')} className="input-field" placeholder="Juan" />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input {...register('apellido')} className="input-field" placeholder="Pérez" />
                {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register('email')} type="email" className="input-field" placeholder="tu@email.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (opcional)</label>
              <input {...register('telefono')} className="input-field" placeholder="+51 999 999 999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input {...register('password')} type="password" className="input-field" placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
              <input {...register('confirmar_password')} type="password" className="input-field" placeholder="Repite tu contraseña" />
              {errors.confirmar_password && <p className="text-red-500 text-xs mt-1">{errors.confirmar_password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2 rounded-xl">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus className="w-5 h-5" /> Crear Cuenta</>}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-700 font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
