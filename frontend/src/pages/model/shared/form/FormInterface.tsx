interface FormInfo {
    id1: string;
    ref1?: any;
    tagName?: string;
    name: string;
    value: any;
    otherTagToClear?: string;
    placeholder?: string;
    disabled?: boolean;
}

export interface RangeInputInfo extends FormInfo {
    id2: string;
    ref2?: any;
}

export interface BasicInputInfo extends FormInfo {
}

export interface LinkedInputInfo extends FormInfo {
}
