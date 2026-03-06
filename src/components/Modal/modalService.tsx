import { createRoot } from "react-dom/client";
import { Modal } from "./Modal";
import { useState } from "react";

interface OpenOptions {
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function ModalWrapper(props: OpenOptions & { onClose: () => void }) {
  const [open, setOpen] = useState(true);

  const close = () => {
    setOpen(false);
    setTimeout(props.onClose, 300); // 等动画结束再卸载
  };

  return (
    <Modal
      open={open}
      title={props.title}
      content={props.content}
      onCancel={() => {
        props.onCancel?.();
        close();
      }}
      onConfirm={() => {
        props.onConfirm?.();
        close();
      }}
    />
  );
}

export const ModalService = {
  open(options: OpenOptions) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      container.remove();
    };

    root.render(<ModalWrapper {...options} onClose={cleanup} />);
  },
};
