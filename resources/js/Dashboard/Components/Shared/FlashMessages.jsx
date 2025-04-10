import { useEffect } from 'react';
import { notification } from 'antd';
import { usePage } from '@inertiajs/react';

const FlashMessages = () => {
    const { flash, errors } = usePage().props;
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (flash?.success) {
            api.success({
                message: 'Success',
                description: flash.success,
                placement: 'topRight',
            });
        }

        if (flash?.error) {
            api.error({
                message: 'Error',
                description: flash.error,
                placement: 'topRight',
            });
        }
    }, [flash]);

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([field, messages]) => {
                const errorText = Array.isArray(messages) ? messages.join(', ') : messages;
                api.error({
                    message: 'Validation Error',
                    description: errorText,
                    placement: 'topRight',
                });
            });
        }
    }, [errors]);

    return contextHolder;
};

export default FlashMessages;