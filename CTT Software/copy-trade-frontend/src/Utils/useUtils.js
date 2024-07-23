import { useSnackbar } from "notistack";

/**
* Custom hook for utility functions.
* @returns {object} - An object containing utility functions.
*/
const useUtils = () => {
    const { enqueueSnackbar } = useSnackbar();

    /**
    * Displays a toast message using the Snackbar component from the notistack library.
    * @param {string} message - The message to be displayed.
    * @param {string} variant - The variant of the toast message (success, error, info, warning).
    * @returns {void} - This function does not return a value.
    */
    const hitToast = (message, variant) => {
        if (!['success', 'error', 'info', 'warning'].includes(variant)) return enqueueSnackbar('Invalid variant!', { variant: 'error' });
        return enqueueSnackbar(message, { variant });
    };

    return {
        hitToast
    }
}

export default useUtils;