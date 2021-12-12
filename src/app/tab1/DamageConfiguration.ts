export type DamageConfiguration = {
    cdct: ConstantDamageOverConstantTime[];
    rdrt: RandomDamageOverRandomTime[];
    cdrt: ConstantDamageOverRandomTime[];
    rdct: RandomDamageOverConstantTime[];
}

type ConstantDamageOverConstantTime = {
    damage: number;
    interval: number;
};

type RandomDamageOverRandomTime = {
    damageMin: number;
    damageMax: number;

    intervalMin: number;
    intervalMax: number;
};

type RandomDamageOverConstantTime = {
    damageMin: number;
    damageMax: number;

    interval: number;
};

type ConstantDamageOverRandomTime = {
    damage: number;

    intervalMin: number;
    intervalMax: number;
}
