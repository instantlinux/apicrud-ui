// Forms validation functions
// created 1-may-2019 by docker@instantlinux.net

import { email, maxLength, maxValue, minLength, minValue, number,
         required } from 'react-admin';

const hasSelection = (message = 'ra.validation.required') =>
    value => value == null ? message : undefined;
const isNameOK = (message = 'Alphanumeric or _&.- characters') =>
    value => value.match(/^[a-zA-Z0-9]+[a-zA-Z0-9 _&.-]*$/) ? undefined : message
const isKeywordAlphaNumeric = (message = 'Alphanumeric or _+@. characters') =>
    value => value.match(/^[a-zA-Z]+[a-zA-Z0-9_+@.]*$/) ? undefined : message;
const isKeywordAlphaNumericLC = (message = 'Lowercase/numeric or _. characters') =>
    value => value.match(/^[a-z]+[a-z0-9_.]*$/) ? undefined : message;
const isCountryCode = (message = 'Use uppercase') =>
    value => value != null &&
      value.match(/^[A-Z][A-Z]$/) ? undefined : message;
const isURI = (message = 'URI format') =>
    value => value && (
      !value.match(/^https?:\/\/[a-zA-Z0-9+_=/.-]{1,56}$/)) ? message : undefined;
const hasComplexity = (message = 'Must have upper, lower, and symbol chars') =>
    value => value != null && !(
      value.match(/[A-Z]+/) && value.match(/[a-z]+/) &&
      value.match(/[@~!#%^&*+=';,{}[|":<>?/\\\].]+/)) ? message : undefined;
const isBlankorMin4Upto32 = (message = 'Between 4 and 32 characters') =>
    value => value && (
      value.length < 4 || value.length > 32) ? message : undefined;
const isBlankorUpto64 = (message = 'Between 2 and 63 characters') =>
    value => value && (
      value.length < 2 || value.length > 64) ? message : undefined;
const isBlankorUpto255 = (message = 'Between 8 and 255 characters') =>
    value => value && (
      value.length < 8 || value.length > 255) ? message : undefined;

export const validateCountry = [required(), minLength(2), maxLength(2),
                                isCountryCode()];
export const validateEmail = [email()];
export const validateURI = [isURI()];
export const validateInteger = [number(), minValue(0)];
export const validateKeywordAlpha = [required(), isKeywordAlphaNumeric()];
export const validateUsername = [required(),
				 isBlankorMin4Upto32(),
				 isKeywordAlphaNumericLC()];
export const validateName = [required(), minLength(4), maxLength(255),
                             isNameOK()];
export const validateNameGeneral = [required(), isNameOK()];
export const validateNameShort = [required(), isBlankorUpto64(), isNameOK()];
export const validatePositive = [number(), minValue(1)];
export const validateNumMax = max => [number(), minValue(1), maxValue(max)];
export const validateSelected = [hasSelection()];
export const validate32String = [isBlankorMin4Upto32()];
export const validate64String = [isBlankorUpto64()];
export const validate255String = [isBlankorUpto255()];
export const validateRequired32String = [required(), minLength(2),
                                         maxLength(32)];
export const validateRequired128String = [required(), minLength(4),
                                          maxLength(128)];
export const validateRequired255String = [required(), minLength(8),
                                          maxLength(255)];
export const validateRequired4096String = [required(), minLength(8),
                                           maxLength(4096)];
export const validatePasswordOK = [required(), minLength(8), maxLength(64),
                                   hasComplexity()];
