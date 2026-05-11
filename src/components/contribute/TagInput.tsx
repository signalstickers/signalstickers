import cx from 'classnames';
import React from 'react';


export interface TagInputProps {
  name: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
  error?: boolean;
}


export default function TagInput({name, tags, onTagsChange, disabled, error}: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [currentText, setCurrentText] = React.useState('');


  const addTag = React.useCallback((text: string) => {
    const trimmed = text.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
    }
    setCurrentText('');
  }, [tags, onTagsChange]);


  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(currentText);
    } else if (e.key === 'Backspace' && currentText === '') {
      e.preventDefault();
      if (tags.length > 0) {
        const lastTag = tags[tags.length - 1];
        onTagsChange(tags.slice(0, -1));
        setCurrentText(lastTag);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  }, [disabled, currentText, tags, onTagsChange, addTag]);


  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentText(e.target.value);
  }, []);


  const removeTag = React.useCallback((index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  }, [tags, onTagsChange]);


  const handleTagClick = React.useCallback((index: number) => {
    if (disabled) return;
    removeTag(index);
  }, [disabled, removeTag]);


  return (
    <div className={cx('border rounded px-2 py-1 d-flex flex-wrap align-items-center', 'min-h-tag-input', error && 'is-invalid')}>
      {tags.map((tag, index) => (
        <button
          key={tag}
          type="button"
          className={cx(
            'btn btn-primary btn-sm px-2 py-1 rounded-lg text-capitalize text-nowrap mr-1 mb-1',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          disabled={disabled}
          onClick={() => handleTagClick(index)}
          title={disabled ? '' : `Remove tag "${tag}"`}
        >
          {tag}
        </button>
      ))}
      <input
        ref={inputRef}
        type="text"
        name={name}
        className="border-0 shadow-none flex-grow-1"
        style={{minWidth: '8rem', display: 'inline-block'}}
        value={currentText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? '' : 'Type a tag + Enter'}
      />
    </div>
  );
}
