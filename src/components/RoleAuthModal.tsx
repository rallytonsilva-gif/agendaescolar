import React, { useState } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../types';
import { getStoredPin, saveStoredPin } from '../utils/storage';

interface RoleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  onSuccessToast: (msg: string) => void;
}

export const RoleAuthModal: React.FC<RoleAuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  onSuccessToast,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  if (!isOpen) return null;

  const currentSavedPin = getStoredPin();

  const handleLoginAsCoordinator = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === currentSavedPin) {
      onRoleChange('coordenador');
      onSuccessToast('Acesso de Coordenador liberado: agora você pode alterar tarefas, horários, cardápio e eventos!');
      setPinInput('');
      setErrorMsg(null);
      onClose();
    } else {
      setErrorMsg('Senha incorreta. Acesso exclusivo da Coordenação/Direção.');
    }
  };

  const handleSwitchToStudent = () => {
    onRoleChange('aluno');
    onSuccessToast('Você está no Modo Aluno (somente leitura para horários, tarefas, eventos e cardápio).');
    onClose();
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setErrorMsg('O novo PIN deve ter pelo menos 4 dígitos.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setErrorMsg('A confirmação do PIN não confere.');
      return;
    }

    saveStoredPin(newPin);
    setIsChangingPin(false);
    setNewPin('');
    setConfirmNewPin('');
    setErrorMsg(null);
    onSuccessToast('Novo PIN da Coordenação salvo com sucesso!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      id="role-auth-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative transition-colors"
        onClick={(e) => e.stopPropagation()}
        id="role-auth-modal-content"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Controle de Acesso Escolar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alternar entre perfil de Aluno e Coordenador
            </p>
          </div>
        </div>

        {/* Role Status Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {currentRole === 'coordenador' ? (
              <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </span>
            ) : (
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </span>
            )}
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Perfil Atual Ativo:</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">
                {currentRole === 'coordenador' ? '🛡️ Coordenador Pedagógico' : '🎓 Aluno (Leitor)'}
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              currentRole === 'coordenador'
                ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {currentRole === 'coordenador' ? 'Acesso Total' : 'Somente Leitura'}
          </span>
        </div>

        {errorMsg && (
          <div
            className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Switch Options */}
        {currentRole === 'aluno' ? (
          <form onSubmit={handleLoginAsCoordinator} className="space-y-4">
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
              <strong>Área Restrita da Coordenação:</strong> Apenas no Modo Coordenador é possível cadastrar, editar, excluir ou restaurar horários de aula, tarefas, cardápio da merenda e eventos da escola.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="coord-pin-input">
                Senha / PIN da Coordenação
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="coord-pin-input"
                  type={showPin ? 'text' : 'password'}
                  className="w-full pl-9.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                  placeholder="Digite a senha da coordenação"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                  aria-label={showPin ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              id="confirm-coordinator-login-btn"
            >
              <ShieldCheck className="w-4 h-4" />
              Entrar como Coordenador
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Modo Coordenador Ativado</strong>
                <p className="mt-0.5 text-emerald-700 dark:text-emerald-300">
                  Você tem permissão para cadastrar provas, agendar reuniões, editar e excluir qualquer evento escolar.
                </p>
              </div>
            </div>

            {isChangingPin ? (
              <form onSubmit={handleChangePinSubmit} className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Alterar PIN da Coordenação</span>
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Cancelar
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Novo PIN (min. 4 dígitos)</label>
                  <input
                    type="password"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-sm"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Ex: 5678"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Confirmar Novo PIN</label>
                  <input
                    type="password"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-sm"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value)}
                    placeholder="Repita o novo PIN"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Salvar Novo PIN
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(true)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 font-medium underline underline-offset-2 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  Mudar senha/PIN da coordenação
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleSwitchToStudent}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              id="switch-to-student-btn"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Sair para o Modo Aluno
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
