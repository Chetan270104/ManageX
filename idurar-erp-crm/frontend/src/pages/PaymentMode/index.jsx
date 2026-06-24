import CrudModule from '@/modules/CrudModule/CrudModule';
import PaymentModeForm from '@/forms/PaymentModeForm';
import useLanguage from '@/locale/useLanguage';

const fields = {
  name: {
    type: 'string',
  },
  description: {
    type: 'string',
  },
  enabled: {
    type: 'boolean',
  },
  isDefault: {
    type: 'boolean',
  },
};

export default function PaymentMode() {
  const translate = useLanguage();
  const entity = 'paymentMode';

  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('payments_mode'),
    DATATABLE_TITLE: translate('payments_mode'),
    ADD_NEW_ENTITY: translate('add_new'),
    ENTITY_NAME: translate('payments_mode'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <CrudModule
      createForm={<PaymentModeForm />}
      updateForm={<PaymentModeForm isUpdateForm />}
      config={config}
    />
  );
}
