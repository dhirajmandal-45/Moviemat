import Modal from './Modal';
export default function ConfirmDialog({ open, onClose, onConfirm, title, body, busy, confirmLabel = 'Delete' }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-slate-600">{body}</p>
      <div className="mt-5 flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Keep</button><button className="btn !bg-danger !text-white hover:!bg-red-700" disabled={busy} onClick={onConfirm}>{busy ? 'Please wait…' : confirmLabel}</button></div>
    </Modal>
  );
}
