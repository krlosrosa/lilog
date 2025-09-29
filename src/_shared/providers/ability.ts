import { AbilityBuilder } from "@casl/ability";
import { AppAbility } from "../stores/auth.store";
import { Ability, AbilityClass } from "@casl/ability";

const { can, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

can('read', 'devolucao');

const abilityTeste = build();
export default abilityTeste;