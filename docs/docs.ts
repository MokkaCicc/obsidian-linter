import MockDate from 'mockdate'
MockDate.set('2020-01-01');
import { readFileSync, writeFileSync } from "fs";
import dedent from "ts-dedent";
import { Rule, rules } from "../rules";

// README

const readme_template = readFileSync("./docs/readme_template.md", "utf8");

const rules_list = rules.map(rule => `- [${rule.name}](docs/rules.md#${rule.alias()})`).join("\n");

const readme = dedent`
				${readme_template}

				${rules_list}

				`;

writeFileSync("README.md", readme);
console.log("README.md updated");

// Rules documentation

const rules_template = readFileSync("./docs/rules_template.md", "utf8");

const rules_docs = rules.map(rule => {
	const examples = rule.examples.map(test => dedent`
		Example: ${test.description}

		Before:

		\`\`\`markdown
		${test.before}
		\`\`\`

		After:

		\`\`\`markdown
		${test.after}
		\`\`\`
	`).join("\n");

	const options_list = rule.options.map(option => `- ${option}`).join("\n");
	let options = "";
	if (options_list.length > 0) {
		options = dedent`
			Options:
			${options_list}
		`;
	}

	return dedent`
	## ${rule.name}

	Alias: ${rule.alias()}

	${rule.description}

	${options}

	${examples}

	`
}).join("\n");

const rules_documentation = dedent`
	${rules_template}

	${rules_docs}
	`;

writeFileSync("./docs/rules.md", rules_documentation);
console.log("Rules documentation updated");