import { Options } from "../modal/modal-options";

export const modalOptions: Options = {
    animations: {
      modal: {
        enter: 'fade-in 0.3s ease-out',
        leave: 'fade-out 0.3s forwards',
      },
      overlay: {
        enter: 'fade-in 0.6s ease-out',
        leave: 'fade-out 0.3s forwards',
      },
    },
    size: {
      width: '40rem',
    },
  }