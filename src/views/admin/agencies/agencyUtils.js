export const isRuleOverlapping = (newRule, rules, editingIndex = null) => {
	return rules.some((rule, index) => {
		if (index === editingIndex) return false;

		return !(
			newRule.toMinutes < rule.fromMinutes ||
			newRule.fromMinutes > rule.toMinutes
		);
	});
};
