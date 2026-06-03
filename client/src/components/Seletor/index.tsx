import React, { useMemo } from 'react';
import Select, { components, type OptionProps } from 'react-select';


export interface OptionType {
  id: number;
  label: string;
  value: string | number;
  isDisabled?: boolean;
}

interface Props {
  options?: OptionType[];
  carregando?: boolean;
  desabilitar?: boolean;
  apagavel?: boolean;
  onModal?: boolean;
  alterarCampo: (valor: OptionType) => void;
  valor?: string;
  mensagemSemOpcoes?: string;
  required?: boolean;
  disabledMessage?: string;
}

const Seletor: React.FC<Props> = ({
  options = [],
  carregando,
  alterarCampo,
  valor,
  desabilitar,
  apagavel = true,
  mensagemSemOpcoes,
  onModal,
  required = false,
  disabledMessage = '',
}) => {

  const Option = (optionProps: OptionProps<OptionType>) => {
    const { data } = optionProps;
    return (
      <components.Option {...optionProps}>
        <span
          className="d-flex align-items-center justify-content-between"
          style={data.isDisabled ? { opacity: 0.5, cursor: 'default' } : {}}>
          <span className="ml-2">
            {data.label}
            {data.isDisabled ? (
              <span className="text-muted">{` (${disabledMessage})`}</span>
            ) : (
              ''
            )}
          </span>
        </span>
      </components.Option>
    );
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      display: 'flex',
      borderRadius: '4px',
      padding: '0 0 0 4px',
      alignItems: 'center',
      // borderColor: tema.cor.input.border,
      // backgroundColor: state.isDisabled
      //   ? tema.cor.input.bgDisabled
      //   : tema.cor.input.bg,
      textAlign: 'left',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      // color: tema.cor.input.text,
    }),
    input: (provided: any) => ({
      ...provided,
      // color: tema.cor.input.text,
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      // color: tema.cor.input.text,
      '&:hover': {
        // color: tema.cor.input.text,
      },
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      // color: tema.cor.input.text,
      '&:hover': {
        // color: tema.cor.input.text,
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9aa5b1',
      textAlign: 'left',
    }),
    menu: (provided: any) => ({
      ...provided,
      '& .fast-option': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      // backgroundColor: tema.cor.input.bg,
      zIndex: 10,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      cursor: 'pointer',

      '&:hover': {
        // backgroundColor: tema.cor.input.selectBgFocused,
        // color: tema.cor.input.bg,
      },

      // backgroundColor: state.isFocused && tema.cor.input.selectBgFocused,
      // color: state.isFocused ? tema.cor.input.bg : tema.cor.input.text,
    }),
  };
  const opcao = useMemo(() => {
    return (
      options.find(
        (opt) => opt.value === valor || String(opt.value) === valor,
      ) ||
      (options as any)
        ?.flatMap((opt: any) => opt?.options)
        .find((opt: any) => opt?.value === Number(valor)) ||
      ''
    );
  }, [options, valor]);

  return (
    <Select
      isClearable={apagavel}
      isLoading={carregando}
      onChange={(opt) => alterarCampo(opt as OptionType)}
      value={
        opcao
          ? {
              id: opcao.id,
              label: opcao.label,
              value: opcao.value,
            }
          : undefined
      }
      options={options}
      styles={customStyles}
      placeholder="Selecione..."
      components={{ Option }}
      noOptionsMessage={() => mensagemSemOpcoes || 'Sem opções'}
      isDisabled={desabilitar}
      menuPosition={'fixed'}
      required={required}
      {...(onModal
        ? {}
        : {
            menuPortalTarget: document.body,
          })}
    />
  );
};

export default Seletor;
