import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import useImperativeIntl from '../../../hooks/useImperativeIntl';
import { Checkbox, ListItemText, MenuItem, Tooltip, styled } from '@mui/material';

import SelectField from '../../atoms/SelectField';
import Typography from '../../atoms/Typography';

import useMultipleSelectField from './useMultipleSelectField';
import Filters from './Filters';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.Mui-disabled': {
    pointerEvents: 'auto',

    '&:hover': {
      backgroundColor: `${theme.palette.background.default} !important`
    }
  }
}));

const MultipleSelectField = forwardRef(
  (
    {
      options,
      selectedOptions,
      size,
      placeholder,
      showCounter,
      showFilters,
      onChange,
      selectAllDisabled,
      tooltipPlacement,
      ...props
    },
    ref
  ) => {
    // forwardRef needed to be able to hold a reference, in this way it can be a child for some Mui components, like Tooltip
    // https://mui.com/material-ui/guides/composition/#caveat-with-refs
    const {
      areAllSelected,
      areAnySelected,
      currentOptions,
      handleChange,
      selectAll,
      unselectAll
    } = useMultipleSelectField({
      options,
      selectedOptions,
      onChange
    });

    const isSmall = size === 'small';
    const paddingSize = isSmall || props.variant === 'standard' ? 0 : 2;

    const intl = useIntl();
    const intlConfig = useImperativeIntl(intl);

    const counterText = `${currentOptions.length} ${intlConfig.formatMessage({
      id: 'c4r.form.selected'
    })}`;

    const renderValue = useMemo(() => {
      if (areAllSelected) {
        return (
          <Typography
            component='span'
            variant={isSmall ? 'body2' : 'body1'}
            color='textPrimary'
            ml={paddingSize}
          >
            {intlConfig.formatMessage({ id: 'c4r.form.allSelected' })}
          </Typography>
        );
      }
      if (areAnySelected) {
        return (
          <Typography
            component='span'
            variant={isSmall ? 'body2' : 'body1'}
            color='textPrimary'
            ml={paddingSize}
          >
            {showCounter && currentOptions.length > 1
              ? counterText
              : currentOptions.join(', ')}
          </Typography>
        );
      }
      return (
        <Typography
          component='span'
          variant={isSmall ? 'body2' : 'body1'}
          color='textSecondary'
          ml={paddingSize}
        >
          {placeholder || intlConfig.formatMessage({ id: 'c4r.form.noneSelected' })}
        </Typography>
      );
    }, [
      areAllSelected,
      areAnySelected,
      counterText,
      currentOptions,
      intlConfig,
      isSmall,
      paddingSize,
      placeholder,
      showCounter
    ]);

    return (
      <SelectField
        {...props}
        ref={ref}
        multiple
        displayEmpty
        placeholder={placeholder}
        value={currentOptions}
        renderValue={() => renderValue}
        onChange={handleChange}
        size={size}
        labelSecondary={
          <Filters
            showFilters={showFilters}
            areAllSelected={areAllSelected}
            areAnySelected={areAnySelected}
            selectAll={selectAll}
            unselectAll={unselectAll}
            selectAllDisabled={selectAllDisabled}
          />
        }
      >
        {options?.map((option) => {
          const item = (
            <StyledMenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              <Checkbox
                disabled={option.disabled}
                checked={currentOptions.indexOf(option.value) > -1}
              />
              <ListItemText primary={option.label} />
            </StyledMenuItem>
          );
          const content = option.tooltip ? (
            <Tooltip
              key={option.value}
              title={option.tooltip}
              placement={tooltipPlacement}
            >
              {item}
            </Tooltip>
          ) : (
            item
          );
          return content;
        })}
      </SelectField>
    );
  }
);

MultipleSelectField.defaultProps = {
  size: 'small',
  showFilters: true
};

MultipleSelectField.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      disabled: PropTypes.bool,
      tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    })
  ).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string),
  selectAllDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  showCounter: PropTypes.bool,
  showFilters: PropTypes.bool,
  tooltipPlacement: PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
};

export default MultipleSelectField;
