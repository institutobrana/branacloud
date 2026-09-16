import { useEffect, useRef, useState } from 'react';
import { lookupCep } from '../../pacientes/components/fichaPessoal/fichaPessoalApi.js';

const digitsOnly = (value) => String(value || '').replace(/\D/g, '');
const formatCep = (digits) => `${digits.slice(0, 5)}-${digits.slice(5)}`;

export function useAgendaContatosCep({ form, onChange, bairros, cidades }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestRef = useRef(null);
  const lastLookupRef = useRef('');
  const formRef = useRef(form);
  useEffect(() => { formRef.current = form; }, [form]);

  const lookup = async (value) => {
    const digits = digitsOnly(value);
    if (digits.length !== 8 || digits === lastLookupRef.current) return null;
    if (requestRef.current?.cep === digits) return requestRef.current.promise;

    const formatted = formatCep(digits);
    onChange({ cep: formatted });
    setError('');
    setLoading(true);

    const promise = lookupCep(digits)
      .then((result) => {
        if (digitsOnly(formRef.current.cep) !== digits) return result;
        const match = (items, value) => {
          const normalized = String(value || '').trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return items.find((item) => String(item.descricao || '').trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '') === normalized);
        };
        const bairro = match(bairros, result.bairro);
        const cidade = match(cidades, result.cidade);
        onChange({
          cep: formatted,
          endereco: result.endereco || formRef.current.endereco,
          bairro: bairro?.descricao || result.bairro || formRef.current.bairro,
          cidade: cidade?.descricao || result.cidade || formRef.current.cidade,
          ...(['SP', 'RJ', 'MG', 'PR', 'SC', 'RS'].includes(String(result.uf || '').toUpperCase()) ? { uf: String(result.uf).toUpperCase() } : {}),
        });
        lastLookupRef.current = digits;
        return result;
      })
      .catch((lookupError) => {
        if (digitsOnly(formRef.current.cep) === digits) setError(lookupError?.message || 'CEP não encontrado.');
        return null;
      })
      .finally(() => {
        if (requestRef.current?.cep === digits) {
          requestRef.current = null;
          setLoading(false);
        }
      });
    requestRef.current = { cep: digits, promise };
    return promise;
  };

  return { lookupCep: lookup, loading, error };
}
