import { useContext } from 'react';
import { Controller } from 'react-hook-form';
import { useB3Lang } from '@b3/lang';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import { GlobaledContext } from '@/shared/global';

import setDayjsLocale from '../ui/setDayjsLocale';

import { PickerFormControl } from './styled';
import Form from './ui';

export default function B3ControlPicker({ control, errors, ...rest }: Form.B3UIProps) {
  const {
    fieldType,
    name,
    default: defaultValue,
    required,
    label,
    validate,
    muiTextFieldProps = {},
    setValue,
    variant,
    getValues,
  } = rest;

  const {
    state: { bcLanguage },
  } = useContext(GlobaledContext);

  const b3Lang = useB3Lang();
  const activeLang = setDayjsLocale(bcLanguage || 'en');

  const { inputFormat = 'YYYY-MM-DD' } = muiTextFieldProps;

  const fieldsProps = {
    type: fieldType,
    name,
    key: name,
    defaultValue,
    rules: {
      required:
        required &&
        b3Lang('global.validate.required', {
          label,
        }),
      validate: validate && ((v: string) => validate(v, b3Lang)),
    },
    control,
  };

  const muixPickerProps = muiTextFieldProps || {};

  const handleDatePickerChange = (value: Date) => {
    try {
      setValue(name, dayjs(value).format(inputFormat));
    } catch (error) {
      setValue(name, value);
    }
  };

  return ['date'].includes(fieldType) ? (
    <PickerFormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={activeLang}>
        <Controller
          {...fieldsProps}
          render={({ field: { ref, ...rest } }) => (
            <DatePicker
              label={label}
              inputFormat={inputFormat}
              {...muixPickerProps}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant={variant || 'filled'}
                  required={required}
                  inputProps={{
                    readOnly: true,
                  }}
                  value={getValues(name) || defaultValue}
                  error={!!errors[name]}
                  helperText={(errors as any)[name] ? (errors as any)[name].message : null}
                />
              )}
              {...rest}
              onChange={handleDatePickerChange}
            />
          )}
        />
      </LocalizationProvider>
    </PickerFormControl>
  ) : null;
}
