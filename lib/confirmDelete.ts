type ConfirmDeleteOptions = {
  title: string;
  text?: string;
  successTitle: string;
  onConfirm: () => unknown | Promise<unknown>;
};

// Every delete on the site goes through this SweetAlert2 dialog: confirm, run the
// delete with a loader, keep the dialog open with the error if it fails, then toast.
export async function confirmDelete({ title, text, successTitle, onConfirm }: ConfirmDeleteOptions): Promise<boolean> {
  // Loaded on demand so pages that never delete don't ship SweetAlert2.
  const { default: Swal } = await import("sweetalert2");

  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "انصراف",
    focusCancel: true,
    buttonsStyling: false,
    customClass: {
      popup: "swal-kaghaz",
      confirmButton: "swal-kaghaz-danger",
      cancelButton: "swal-kaghaz-cancel",
    },
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      try {
        await onConfirm();
        return true;
      } catch (error) {
        Swal.showValidationMessage(error instanceof Error ? error.message : "حذف انجام نشد.");
        return false;
      }
    },
  });

  if (result.isConfirmed) {
    void Swal.fire({
      toast: true,
      position: "top",
      icon: "success",
      title: successTitle,
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
      customClass: { popup: "swal-kaghaz-toast" },
    });
  }

  return result.isConfirmed;
}
