import React from 'react';
import {InputGroup} from 'react-bootstrap';
import {BasicInputInfo} from '../../FormInterface';
import {FormControlPlus} from '../FormControlPlus';

// export function basicInput(input: BasicInputInfo) {
//     return (
//         <div>
//             <InputGroup className="mb-3">
//                 <InputGroup.Prepend>
//                     <InputGroup.Text> {input.name} </InputGroup.Text>
//                 </InputGroup.Prepend>
//                 <FormControl
//                     id={input.id1}
//                     value={input.value}
//                     placeholder={input.placeholder}
//                 />
//             </InputGroup>
//         </div>
//     );
// }


export function basicInput(input: BasicInputInfo) {
    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text> {input.name} </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControlPlus
                    ref={input.ref1}
                    id={input.id1}
                    value={input.value}
                    placeholder={input.placeholder}
                />
            </InputGroup>
        </div>
    );
}
