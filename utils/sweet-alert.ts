import Swal from 'sweetalert2'

interface DeleteConfirmationOptions {
    title?: string
    text?: string
    confirmButtonText?: string
    cancelButtonText?: string
    successTitle?: string
    successText?: string
    errorTitle?: string
    errorText?: string
}

/**
 * Shows a delete confirmation dialog and executes the delete function if confirmed
 * 
 * @param deleteFunction - The function to call for deletion
 * @param id - The ID of the item to delete
 * @param refetchFunction - Function to refresh data after deletion
 * @param options - Custom text options for the dialogs
 * @returns Promise<boolean> - Whether the deletion was confirmed and successful
 */
export const showDeleteConfirmation = async (
    deleteFunction: (id: number | string | object) => Promise<any>,
    id: number | string | object,
    refetchFunction?: () => Promise<any> | void,
    options?: DeleteConfirmationOptions
): Promise<boolean> => {
    const defaultOptions: Required<DeleteConfirmationOptions> = {
        title: "Bu elementi silmək istəyirsinizmi?",
        text: "Bunu geri qaytara bilməyəcəksiniz!",
        confirmButtonText: "Bəli",
        cancelButtonText: "Xeyr",
        successTitle: "Silindi!",
        successText: "Element uğurla silindi.",
        errorTitle: "Xəta!",
        errorText: "Silinmə zamanı xəta baş verdi."
    }

    const finalOptions = { ...defaultOptions, ...options }

    try {
        const result = await Swal.fire({
            title: finalOptions.title,
            text: finalOptions.text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: finalOptions.confirmButtonText,
            cancelButtonText: finalOptions.cancelButtonText,
        })

        if (result.isConfirmed) {
            try {
                await deleteFunction(id)

                await Swal.fire({
                    title: finalOptions.successTitle,
                    text: finalOptions.successText,
                    icon: "success"
                })

                if (refetchFunction) {
                    await refetchFunction()
                }

                return true
            } catch (error) {
                console.error("Delete operation failed:", error)

                await Swal.fire({
                    title: finalOptions.errorTitle,
                    text: finalOptions.errorText,
                    icon: "error"
                })

                return false
            }
        }

        return false
    } catch (error) {
        console.error("SweetAlert error:", error)
        return false
    }
}


