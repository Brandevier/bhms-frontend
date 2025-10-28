import React from 'react';
// import DoseCalculatorModal from '../../../../modal/DoseCalculatorModal';
import DoseCalculatorComponent from '../../../shared/DoseCalculatorComponent';



const DoseCalculatorButton = () => {
    return (
        <div>
            <DoseCalculatorComponent medications={[]} />
        </div>
    );
};

export default DoseCalculatorButton;