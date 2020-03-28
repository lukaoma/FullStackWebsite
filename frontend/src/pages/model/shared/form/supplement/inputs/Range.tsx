import React from 'react';
import {InputGroup} from 'react-bootstrap';
import {updateAllElementsWithTag} from './Common';
import {RangeInputInfo} from '../../FormInterface';
import {FormControlPlus} from '../FormControlPlus';

// export function rangeInput(input: RangeInputInfo) {
//     return (
//         <div>
//             <InputGroup className="mb-3">
//                 <InputGroup.Text className=''> {input.name} </InputGroup.Text>
//                     <FormControl
//                         id={input.id1}
//                         ref={input.ref1}
//                         name={input.tagName}
//                         placeholder="min."
//                         value={input.value}
//                         onChange={() => updateAllElementsWithTag(input.otherTagToClear, "")}
//                     />
//                     <FormControl
//                         id={input.id2}
//                         ref={input.ref2}
//                         name={input.tagName}
//                         placeholder="max."
//                         value={input.value}
//                         onChange={() => updateAllElementsWithTag(input.otherTagToClear, "")}
//                     />
//             </InputGroup>
//         </div>
//     );
// }

export function rangeInput(input: RangeInputInfo) {
    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Text className=''> {input.name} </InputGroup.Text>
                <InputGroup.Append>
                    <FormControlPlus
                        id={input.id1}
                        ref={input.ref1}
                        name={input.tagName}
                        placeholder="min."
                        value={input.value}
                        onChange={() => updateAllElementsWithTag(input.otherTagToClear, "")}
                    />
                    <FormControlPlus
                        id={input.id2}
                        ref={input.ref2}
                        name={input.tagName}
                        placeholder="max."
                        value={input.value}
                        onChange={() => updateAllElementsWithTag(input.otherTagToClear, "")}
                    />
                </InputGroup.Append>

            </InputGroup>
        </div>
    );
}