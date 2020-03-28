import React from 'react';
import {InputGroup} from 'react-bootstrap';
import {linkedInputOnChangeHelper, updateAllElementsWithTag} from './Common';
import {LinkedInputInfo} from '../../FormInterface';
import {FormControlPlus} from '../FormControlPlus';

// export function linkedInput(input: LinkedInputInfo) {
//     let ele =
//         <FormControl
//             id={input.id1}
//             disabled={input.disabled}
//             name={input.tagName}
//             value={input.value}
//             onChange={(e) => {
//                 linkedInputOnChangeHelper(input.id1, input.tagName);
//                 if (input.otherTagToClear != null) updateAllElementsWithTag(input.otherTagToClear, "");
//             }}
//         />

//     return (
//         <div>
//             <InputGroup className="mb-3">
//                 <InputGroup.Prepend>
//                     <InputGroup.Text> {input.name} </InputGroup.Text>
//                 </InputGroup.Prepend>
//                 {ele}
//             </InputGroup>
//         </div>
//     );
// }


export function linkedInput(input: LinkedInputInfo) {
    let ele =
        <FormControlPlus
            id={input.id1}
            disabled={input.disabled}
            ref={input.ref1}
            name={input.tagName}
            value={input.value}
            onChange={(e) => {
                linkedInputOnChangeHelper(input.id1, input.tagName);
                if (input.otherTagToClear != null) updateAllElementsWithTag(input.otherTagToClear, "");
            }}
        />;

    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text> {input.name} </InputGroup.Text>
                </InputGroup.Prepend>
                {ele}
            </InputGroup>
        </div>
    );
}

