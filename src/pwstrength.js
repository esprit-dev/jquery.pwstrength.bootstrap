/*jslint vars: false, browser: true, nomen: true, regexp: true */
/*global jQuery */

/*
* jQuery Password Strength plugin for Twitter Bootstrap
*
* Copyright (c) 2008-2013 Tane Piper
* Copyright (c) 2013 Alejandro Blanco
* Dual licensed under the MIT and GPL licenses.
*
*/

(function ($) {
    "use strict";

    var options = {
            errors: [],
            minChar: 8,
            errorMessages: {
                password_to_short: "The Password is too short",
                same_as_username: "Your password cannot be the same as your username"
            },
            progressClass: ['zero', 'twenty-five', 'fifty', 'seventy-five', 'one-hundred'],
            scores: [17, 26, 40, 50],
            verdicts: ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
            showVerdicts: true,
            raisePower: 1.4,
            usernameField: "#username",
            onLoad: undefined,
            onKeyUp: undefined,
            ruleScores: {
                wordNotEmail: -100,
                wordLength: -100,
                wordSimilarToUsername: -100,
                wordLowercase: 1,
                wordUppercase: 3,
                wordOneNumber: 3,
                wordThreeNumbers: 5,
                wordOneSpecialChar: 3,
                wordTwoSpecialChar: 5,
                wordUpperLowerCombo: 2,
                wordLetterNumberCombo: 2,
                wordLetterNumberCharCombo: 2
            },
            rules: {
                wordNotEmail: true,
                wordLength: true,
                wordSimilarToUsername: true,
                wordLowercase: true,
                wordUppercase: true,
                wordOneNumber: true,
                wordThreeNumbers: true,
                wordOneSpecialChar: true,
                wordTwoSpecialChar: true,
                wordUpperLowerCombo: true,
                wordLetterNumberCombo: true,
                wordLetterNumberCharCombo: true
            },
            validationRules: {
                wordNotEmail: function (options, word, score) {
                    return word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i) && score;
                },
                wordLength: function (options, word, score) {
                    var wordlen = word.length,
                        lenScore = Math.pow(wordlen, options.raisePower);
                    if (wordlen < options.minChar) {
                        lenScore = (lenScore + score);
                        options.errors.push(options.errorMessages.password_to_short);
                    }
                    return lenScore;
                },
                wordSimilarToUsername: function (options, word, score) {
                    var username = $(options.usernameField).val();
                    if (username && word.toLowerCase().match(username.toLowerCase())) {
                        options.errors.push(options.errorMessages.same_as_username);
                        return score;
                    }
                    return true;
                },
                wordLowercase: function (options, word, score) {
                    return word.match(/[a-z]/) && score;
                },
                wordUppercase: function (options, word, score) {
                    return word.match(/[A-Z]/) && score;
                },
                wordOneNumber : function (options, word, score) {
                    return word.match(/\d+/) && score;
                },
                wordThreeNumbers : function (options, word, score) {
                    return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
                },
                wordOneSpecialChar : function (options, word, score) {
                    return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
                },
                wordTwoSpecialChar : function (options, word, score) {
                    return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
                },
                wordUpperLowerCombo : function (options, word, score) {
                    return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
                },
                wordLetterNumberCombo : function (options, word, score) {
                    return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
                },
                wordLetterNumberCharCombo : function (options, word, score) {
                    return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
                }
            }
        },

        setProgressBar = function ($el, score) {
            var options = $el.data("pwstrength"),
                progressbar = options.progressbar;

            $el[score >= options.scores[0] && score < options.scores[1] ? "addClass" : "removeClass"]("password-" + options.progressClass[1]);
            $el[score >= options.scores[1] && score < options.scores[2] ? "addClass" : "removeClass"]("password-" + options.progressClass[2]);
            $el[score >= options.scores[2] && score < options.scores[3] ? "addClass" : "removeClass"]("password-" + options.progressClass[3]);
            $el[score >= options.scores[3] ? "addClass" : "removeClass"]("password-" + options.progressClass[4]);

            if (score < options.scores[0]) {
                progressbar.addClass("progress-danger").removeClass("progress-warning").removeClass("progress-success");
                progressbar.find(".bar").css("width", "5%");
                if (options.showVerdicts) {
                    $el.children().html('<span class="password-verdict">' + options.verdicts[0] + '</span>');
                }
            } else if (score >= options.scores[0] && score < options.scores[1]) {
                progressbar.addClass("progress-danger").removeClass("progress-warning").removeClass("progress-success");
                progressbar.find(".bar").css("width", "25%");
                if (options.showVerdicts) {
                    $el.children().html('<span class="password-verdict">' + options.verdicts[1] + '</span>');
                }
            } else if (score >= options.scores[1] && score < options.scores[2]) {
                progressbar.addClass("progress-warning").removeClass("progress-danger").removeClass("progress-success");
                progressbar.find(".bar").css("width", "50%");
                if (options.showVerdicts) {
                    $el.children().html('<span class="password-verdict">' + options.verdicts[2] + '</span>');
                }
            } else if (score >= options.scores[2] && score < options.scores[3]) {
                progressbar.addClass("progress-warning").removeClass("progress-danger").removeClass("progress-success");
                progressbar.find(".bar").css("width", "75%");
                if (options.showVerdicts) {
                    $el.children().html('<span class="password-verdict">' + options.verdicts[3] + '</span>');
                }
            } else if (score >= options.scores[3]) {
                progressbar.addClass("progress-success").removeClass("progress-warning").removeClass("progress-danger");
                progressbar.find(".bar").css("width", "100%");
                if (options.showVerdicts) {
                    $el.children().html('<span class="password-verdict">' + options.verdicts[4] + '</span>');
                }
            }
        },

        calculateScore = function ($el) {
            var self = this,
                word = $el.val(),
                totalScore = 0,
                options = $el.data("pwstrength");

            $.each(options.rules, function (rule, active) {
                if (active === true) {
                    var score = options.ruleScores[rule],
                        result = options.validationRules[rule](options, word, score);
                    if (result) {
                        totalScore += result;
                    }
                }
            });
            setProgressBar($el, totalScore);
            return totalScore;
        },

        progressWidget = function () {
            return '<div class="progress"><div class="bar"></div></div>';
        },

        methods = {
            init: function (settings) {
                var self = this,
                    allOptions = $.extend(options, settings);

                return this.each(function (idx, el) {
                    var $el = $(el),
                        progressbar;

                    $el.data("pwstrength", allOptions);

                    $el.on("keyup", function (event) {
                        var options = $el.data("pwstrength");
                        options.errors = [];
                        calculateScore.call(self, $el);
                        if ($.isFunction(options.onKeyUp)) {
                            options.onKeyUp(event);
                        }
                    });

                    progressbar = $(progressWidget());
                    progressbar.insertAfter($el);
                    progressbar.find(".bar").css("width", "0%");
                    $el.data("pwstrength").progressbar = progressbar;

                    if (allOptions.showVerdicts) {
                        $el.children().html('<span class="password-verdict">' + allOptions.verdicts[0] + '</span>');
                    }
                    if ($.isFunction(allOptions.onLoad)) {
                        allOptions.onLoad();
                    }
                });
            },

            destroy: function () {
                this.each(function (idx, el) {
                    var $el = $(el);
                    $el.find("span.password-verdict").remove();
                    $el.parent().find("div.progress").remove();
                    $el.parent().find("ul.error-list").remove();
                    $el.removeData("pwstrength");
                });
            },

            outputErrorList: function () {
                this.each(function (idx, el) {
                    var output = '<ul class="error-list">',
                        $el = $(el);
                    $el.parent().find("ul.error-list").remove();
                    $.each($el.data("pwstrength").errors, function (i, item) {
                        output += '<li>' + item + '</li>';
                    });
                    output += '</ul>';
                    output = $(output);
                    output.insertAfter(el);
                });
            },

            addRule: function (name, method, score, active) {
                this.each(function (idx, el) {
                    var options = $(el).data("pwstrength");
                    options.rules[name] = active;
                    options.ruleScores[name] = score;
                    options.validationRules[name] = method;
                });
            },

            changeScore: function (rule, score) {
                this.each(function (idx, el) {
                    $(el).data("pwstrength").ruleScores[rule] = score;
                });
            },

            ruleActive: function (rule, active) {
                this.each(function (idx, el) {
                    $(el).data("pwstrength").rules[rule] = active;
                });
            }
        };

    $.fn.pwstrength = function (method) {
        var result;
        if (methods[method]) {
            result = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            result = methods.init.apply(this, arguments);
        } else {
            $.error("Method " +  method + " does not exist on jQuery.pwstrength");
        }
        return result;
    };
}(jQuery));
