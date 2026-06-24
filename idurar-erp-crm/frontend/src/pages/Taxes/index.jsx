import CrudModule from '@/modules/CrudModule/CrudModule';
import TaxForm from '@/forms/TaxForm';
import useLanguage from '@/locale/useLanguage';

const fields = {
  taxName: {
    type: 'string',
  },
  taxValue: {
    type: 'number',
  },
  enabled: {
    type: 'boolean',
  },
  isDefault: {
    type: 'boolean',
  },
};

export default function Taxes() {
  const translate = useLanguage();
  const entity = 'taxes';

  const searchConfig = {
    displayLabels: ['taxName'],
    searchFields: 'taxName',
  };

  const deleteModalLabels = ['taxName'];

  const Labels = {
    PANEL_TITLE: translate('taxes'),
    DATATABLE_TITLE: translate('taxes_list'),
    ADD_NEW_ENTITY: translate('add_new'),
    ENTITY_NAME: translate('taxes'),
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

  return <CrudModule createForm={<TaxForm />} updateForm={<TaxForm isUpdateForm />} config={config} />;
}
