const {Manager} = require("./lib/model/Manager");
const {Engineer} = require("./lib/model/Engineer");
const {Intern} = require("./lib/model/Intern");
const {PageRenderer} = require("./lib/render/PageRenderer");

const inquirer = require('inquirer');
const fs = require('fs');
const moment = require('moment');

class HTMLRenderer {
    constructor(showLog = false) {
        this.showLog = showLog;
        this.render = this.render.bind(this);
    }

    render(employees) {
        if (this.showLog) {
            console.log(`HTML Renderer: starting html generation with employees:`);
            console.log(employees);
        }
        let pageRenderer = new PageRenderer(employees);
        return pageRenderer.render();
    }

}


class Validator {
    constructor(showLog = false) {
        this.showLog = showLog;

        this.ensureNotEmptyString = this.ensureNotEmptyString.bind(this);
        this.canBeEmptyString = this.canBeEmptyString.bind(this);
    }

    ensureNotEmptyString(userInput, answersHash) {
        if (this.showLog) {
            console.log("Validator: ensure not empty string");
            console.log(userInput);
            console.log(answersHash);
        }
        let isEmpty = (userInput.trim().length === 0);
        if (isEmpty) {
            return `Value must be a non-empty string.`;
        }
        return true;
    }

    canBeEmptyString(userInput, answersHash) {
        return true;
    }

    isEmailAddress(userInput, answersHash) {
        if (this.showLog) {
            console.log("Validator: check for valid email address");
            console.log(userInput);
            console.log(answersHash);
        }
        let isEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(userInput);
        if (!isEmail) {
            return "Not a valid email address";
        }
        return isEmail;
    }

}

class Filter {
    constructor(showLog = false) {
        this.showLog = showLog;

        this.defaultFilter = this.defaultFilter.bind(this);
    }

    defaultFilter(userInput, answersHash) {
        if (this.showLog) {
            console.log("Filter: defaultFilter");
            console.log(userInput);
            console.log(answersHash);
        }
        return userInput;
    }
}

class Transformer {
    constructor(showLog = false) {
        this.showLog = showLog;

        this.defaultTransformer = this.defaultTransformer.bind(this);
        this.gitHubPrefix = this.gitHubPrefix.bind(this);
        this.onlyAllowNumbers = this.onlyAllowNumbers.bind(this);
    }

    defaultTransformer(userInput, answersHash, options) {
        if (this.showLog) {
            console.log("Transformer: defaultTransformer");
            console.log(userInput);
            console.log(answersHash);
            console.log(options);
        }
        return userInput;
    }

    gitHubPrefix(userInput, answersHash, options) {
        if (this.showLog) {
            console.log("Transformer: gitHubPrefix");
            console.log(userInput);
            console.log(answersHash);
            console.log(options);
        }
        return "https://github.com/" + userInput;
    }

    onlyAllowNumbers(userInput, answersHash, options) {
        if (this.showLog) {
            console.log("Transformer: onlyAllowNumbers");
            console.log(userInput);
            console.log(answersHash);
            console.log(options);
        }
        return userInput.replace(/[^0-9]/g, '').trim();
    }
}

class When {
    constructor(showLog = false) {
        this.showLog = showLog;

        this.isMandatoryQuestion = this.isMandatoryQuestion.bind(this);
        this.isOptionalQuestion = this.isOptionalQuestion.bind(this);
    }

    isMandatoryQuestion(answersHash) {
        if (this.showLog) {
            console.log("When: isMandatory");
            console.log(answersHash);
        }
        return true;
    }

    isOptionalQuestion(answersHash) {
        if (this.showLog) {
            console.log("When: isOptional");
            console.log(answersHash);
        }
        return false;
    }

}


class TeamProfileGenerator {
    constructor(showDebugOutput = false) {
        this.validator = new Validator(showDebugOutput);
        this.filter = new Filter(showDebugOutput);
        this.transformer = new Transformer(showDebugOutput);
        this.when = new When(showDebugOutput);
        this.renderer = new HTMLRenderer(showDebugOutput);

        this.isManager = this.isManager.bind(this);
        this.isEngineer = this.isEngineer.bind(this);
        this.isIntern = this.isIntern.bind(this);

        this.employeeType = "manager";
    }

    isManager(answersHash) {
        return (this.employeeType === "manager");
    }

    isEngineer(answersHash) {
        return (this.employeeType === "engineer");
    }

    isIntern(answersHash) {
        return (this.employeeType === "intern");
    }


    init() {

        this.employeeQuestions = [
            {
                name: "name",
                type: "input",
                message: "Please provide a name for the Employee:",
                default: "Name",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "id",
                type: "input",
                message: "Please the id for the Employee:",
                default: "1",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.onlyAllowNumbers,
                when: this.when.isMandatoryQuestion,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "email",
                type: "input",
                message: "Email address:",
                default: "Email",
                validate: this.validator.isEmailAddress,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.when.isMandatoryQuestion,
                //pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "officeNumber",
                type: "input",
                message: "Please the office number for the Employee:",
                default: "1",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.onlyAllowNumbers,
                when: this.isManager,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "school",
                type: "input",
                message: "Please provide a school name for the Employee:",
                default: "School",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.isIntern,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
            {
                name: "username",
                type: "input",
                message: "GitHub username:",
                default: "mygithubusername",
                validate: this.validator.ensureNotEmptyString,
                filter: this.filter.defaultFilter,
                transformer: this.transformer.defaultTransformer,
                when: this.isEngineer,
                pageSize: 10,
                askAnswered: true,
                loop: true,
            },
        ];


        this.choiceMenu = [
            {
                name: "type",
                type: "list",
                message: "What you like to do:",
                choices: [
                    {
                        name: "Add Engineer",
                        value: "engineer",
                        short: "engineer"
                    },
                    {
                        name: "Add Intern",
                        value: "intern",
                        short: "intern"
                    },
                    {
                        name: "Have finished entering the team details",
                        value: "finished",
                        short: "finished"
                    },
                ],
            }
        ];
    }

    convertAnswersToEmployee(employeeType, answers) {
        let employee = null;
        switch (employeeType) {
            case "manager": {
                employee = new Manager();
                employee.setOfficeNumber(parseInt(answers.officeNumber));
                break;
            }
            case "engineer": {
                employee = new Engineer();
                employee.setGitHubUsername(answers.username);
                break;
            }
            case "intern": {
                employee = new Intern();
                employee.setSchool(answers.school);
                break;
            }
        }
        employee.setId(parseInt(answers.id));
        employee.setName(answers.name);
        employee.setEmail(answers.email);


        return employee;
    }

    askForNextEmployee(employees) {
        inquirer.prompt(this.choiceMenu)
            .then((answers) => {
                // if the chose finished, we are done
                if (answers.type !== "finished") {
                    this.employeeType = answers.type;
                    inquirer.prompt(this.employeeQuestions, {
                        type: answers.type,
                    })
                        .then((answers) => {
                            let employee = this.convertAnswersToEmployee(this.employeeType,answers);
                            employees.push(employee);
                            this.askForNextEmployee(employees);
                            // write to the file
                            let render = new HTMLRenderer(this.showLog);
                            let html = render.render(employees);
                            this.writeToFile("./dist/index.html",html);

                        })
                        .catch((error) => {
                            if (error.isTtyError) {
                                // Prompt couldn't be rendered in the current environment
                                console.log("Must be running in a terminal/command window.");
                            } else {
                                console.log(error);
                                console.log("Unknown error occurred.")
                            }

                        });
                }
            })
            .catch((error) => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                    console.log("Must be running in a terminal/command window.");
                } else {
                    console.log(error);
                    console.log("Unknown error occurred.")
                }

            })
    }


    start() {
        // start with asking question for the team manager
        let employees = [];
        this.employeeType = "manager";
        inquirer.prompt(this.employeeQuestions)
            .then((answers) => {
                // convert the answers to an employee
                let employee = this.convertAnswersToEmployee(this.employeeType, answers);
                employees.push(employee);
                // ok, now we can build the team - looping and asking the user each time
                this.askForNextEmployee(employees);

            })
            .catch((error) => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                    console.log("Must be running in a terminal/command window.");
                } else {
                    console.log(error);
                    console.log("Unknown error occurred.")
                }
            })
    }

    writeToFile(filename, data) {
        console.log(`Writing to file ${filename}`);
        // check to see if the file already exist
        let markdownFile = fs.createWriteStream(filename, {flags: 'w'});
        markdownFile.write(data);
        markdownFile.close();
    }
}

let showDebugOutput = false;

let generator = new TeamProfileGenerator(showDebugOutput);
generator.init();
generator.start();