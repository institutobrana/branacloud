import { memo, useEffect, useRef, useState } from 'react';
import { Input } from 'antd';

export const PROCEDIMENTOS_SEARCH_DELAY = 200;

// Only the remote query waits. Typing never traverses the App/Page event roundtrip.
export const ProcedimentosSearchInput = memo(function ProcedimentosSearchInput({ value = '', disabled, onSearch, ...props }) {
  const [draft, setDraft] = useState(value);
  const latestDraft = useRef(draft);
  latestDraft.current = draft;
  const pending = useRef(null);
  const published = useRef(value);
  const callback = useRef(onSearch);
  callback.current = onSearch;

  const cancel = () => {
    clearTimeout(pending.current);
    pending.current = null;
  };
  const publish = (next) => {
    cancel();
    if (next === published.current) return;
    published.current = next;
    callback.current(next);
  };

  useEffect(() => {
    // An echo of our last query must not erase newer text still being typed.
    if (value !== published.current) {
      cancel();
      published.current = value;
      setDraft(value);
    }
  }, [value]);
  useEffect(() => {
    if (disabled) cancel();
    else if (latestDraft.current !== published.current) {
      pending.current = setTimeout(() => publish(latestDraft.current), PROCEDIMENTOS_SEARCH_DELAY);
    }
    return cancel;
  }, [disabled]);

  return <Input.Search {...props} allowClear size="small" value={draft} disabled={disabled}
    onChange={(event) => {
      const next = event.target.value;
      setDraft(next);
      cancel();
      if (!next) publish(next);
      else pending.current = setTimeout(() => publish(next), PROCEDIMENTOS_SEARCH_DELAY);
    }}
    onSearch={(next) => { setDraft(next); publish(next); }} />;
});
