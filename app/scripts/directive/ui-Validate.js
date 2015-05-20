'use strict';
/**
 * General-purpose validator for ngModel.
 * angular.js comes with several built-in validation mechanism for input fields (ngRequired, ngPattern etc.) but using
 * an arbitrary validation function requires creation of a custom formatters and / or parsers.
 * The ui-validate directive makes it easy to use any function(s) defined in scope as a validator function(s).
 * A validator function will trigger validation on both model and input changes.
 *
 * @example <input ui-validate=" 'myValidatorFunction($value)' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }">
 * @example <input ui-validate="{ foo : '$value > anotherModel' }" ui-validate-watch=" 'anotherModel' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }" ui-validate-watch=" { foo : 'anotherModel' } ">
 *
 * @param ui-validate {string|object literal} If strings is passed it should be a scope's function to be used as a validator.
 * If an object literal is passed a key denotes a validation error key while a value should be a validator function.
 * In both cases validator function should take a value to validate as its argument and should return true/false indicating a validation result.
 */
angular.module('ui.validate', []).directive('uiValidate', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var validateFn, validators = {}, validateExpr = scope.$eval(attrs.uiValidate);
      if (!validateExpr) {
        return;
      }
      if (angular.isString(validateExpr)) {
        validateExpr = { validator: validateExpr };
      }
      angular.forEach(validateExpr, function (exprssn, key) {
        validateFn = function (valueToValidate) {
          var expression = scope.$eval(exprssn, { '$value': valueToValidate });
          if (angular.isObject(expression) && angular.isFunction(expression.then)) {
            // expression is a promise
            expression.then(function () {
              ctrl.$setValidity(key, true);
            }, function () {
              ctrl.$setValidity(key, false);
            });
            return valueToValidate;
          } else if (expression) {
            // expression is true
            ctrl.$setValidity(key, true);
            return valueToValidate;
          } else {
            // expression is false
            ctrl.$setValidity(key, false);
            return valueToValidate;
          }
        };
        validators[key] = validateFn;
        ctrl.$formatters.push(validateFn);
        ctrl.$parsers.push(validateFn);
      });
      function apply_watch(watch) {
        //string - update all validators on expression change
        if (angular.isString(watch)) {
          scope.$watch(watch, function () {
            angular.forEach(validators, function (validatorFn) {
              validatorFn(ctrl.$modelValue);
            });
          });
          return;
        }
        //array - update all validators on change of any expression
        if (angular.isArray(watch)) {
          angular.forEach(watch, function (expression) {
            scope.$watch(expression, function () {
              angular.forEach(validators, function (validatorFn) {
                validatorFn(ctrl.$modelValue);
              });
            });
          });
          return;
        }
        //object - update appropriate validator
        if (angular.isObject(watch)) {
          angular.forEach(watch, function (expression, validatorKey) {
            //value is string - look after one expression
            if (angular.isString(expression)) {
              scope.$watch(expression, function () {
                validators[validatorKey](ctrl.$modelValue);
              });
            }
            //value is array - look after all expressions in array
            if (angular.isArray(expression)) {
              angular.forEach(expression, function (intExpression) {
                scope.$watch(intExpression, function () {
                  validators[validatorKey](ctrl.$modelValue);
                });
              });
            }
          });
        }
      }
      // Support for ui-validate-watch
      if (attrs.uiValidateWatch) {
        apply_watch(scope.$eval(attrs.uiValidateWatch));
      }
    }
  };
})

.directive('aTooltip', ['$timeout',
    function ($timeout) {
        //<div data-original-title="tootip title" a-tooltip="tootipOption"></div>
        // tootipOption = {
        //     validate: false, // if true, use for AngularJS validation
        //     validateMsg : {
        //         required: 'Required!',
        //         minlength: 'Too short!'
        //     }
        //     ...other bootstrap tooltip options
        // }
        return {
            require: '?ngModel',
            link: function (scope, element, attr, ctrl) {
                var enable = false,
                    option = scope.$eval(attr.aTooltip) || {};

                var isVisible = function (element) {
                  var rect = element[0].getBoundingClientRect();
                  return Boolean(rect.bottom - rect.top);
                }

                function invalidMsg(invalid) {
                    ctrl.validate = enable && option.validate && isVisible(element);
                    if (ctrl.validate) {
                        var title = (ctrl.$name && ctrl.$name + ' ') || '';
                        if (invalid && option.validateMsg) {
                            angular.forEach(ctrl.$error, function (value, key) {
                                title += (value && option.validateMsg[key] && option.validateMsg[key] + ', ') || '';
                            });
                        }
                        title = title.slice(0, -2) || attr.originalTitle || attr.title;
                        attr.$set('dataOriginalTitle', title ? title : '');
                        showTooltip( !! invalid);
                    } else {
                        showTooltip(false);
                    }
                }

                function validateFn(value) {
                    $timeout(function () {
                        invalidMsg(ctrl.$invalid);
                    });
                    return value;
                }

                function initTooltip() {
                    element.off('.tooltip').removeData('bs.tooltip');
                    element.tooltip(option);
                }

                function showTooltip(show) {
                    if (element.hasClass('invalid-error') !== show) {
                        element[show ? 'addClass' : 'removeClass']('invalid-error');
                        element.tooltip(show ? 'show' : 'hide');
                    }
                }

                if (option.container === 'inner') {
                    option.container = element;
                } else if (option.container === 'ngView') {
                    option.container = element.parents('.ng-view')[0] || element.parents('[ng-view]')[0];
                }
                // use for AngularJS validation
                if (option.validate) {
                    option.template = '<div class="tooltip validate-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
                    option.trigger = 'manual';
                    option.placement = option.placement || 'right';
                    if (ctrl) {
                        ctrl.$formatters.push(validateFn);
                        ctrl.$parsers.push(validateFn);
                    } else {
                        scope.$watch(function () {
                            return attr.originalTitle || attr.dataOriginalTitle;
                        }, showTooltip);
                    }
                    element.bind('focus', function () {
                        element.trigger('input');
                        element.trigger('change');
                    });
                    scope.$on('genTooltipValidate', function (event, collect, turnoff) {
                        enable = !turnoff;
                        if (ctrl) {
                            if (angular.isArray(collect)) {
                                collect.push(ctrl);
                            }
                            invalidMsg(ctrl.$invalid);
                        }
                    });
                } else if (option.click) {
                    // option.click will be 'show','hide','toggle', or 'destroy'
                    element.bind('click', function () {
                        element.tooltip(option.click);
                    });
                }
                element.bind('hidden.bs.tooltip', initTooltip);
                initTooltip();
            }
        };
    }
])