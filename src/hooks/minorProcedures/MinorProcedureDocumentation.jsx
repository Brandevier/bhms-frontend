import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchMedicationByCode, selectAllMedications } from '../redux/slice/nhia_medicationsSlice';
import { fetchMedicationByCode, selectMedicationByCode,selectLoading} from '../../redux/slice/nhia_medicationsSlice';
import MedicationSearch from './MedicationSearch';
import MedicationDisplay from './MedicationDisplay';
import ProcedureNotes from './ProcedureNotes';
import ProcedureInfo from './ProcedureInfo';
import './MinorProcedurePage.css';

const MinorProcedurePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);
  const [medications, setMedications] = useState([]);
  const [notes, setNotes] = useState([]); 
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState('In Progress');
  
  const dispatch = useDispatch();
  const searchResults = useSelector(selectMedicationByCode);
  const loading = useSelector(selectLoading)
  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.length >= 3) {
      dispatch(fetchMedicationByCode(value));
    }
  };

 const handleMedSelect = (value, medication) => {
    setSelectedMed({
      ...medication,
      quantity: 1,
      marketPrice: medication.price_ghc
    });
    setSearchQuery(medication.generic_name); // Show name instead of code
  };

  const handleQuantityChange = (value) => {
    setSelectedMed(prev => ({ ...prev, quantity: value }));
  };

  const handleMarketPriceChange = (value) => {
    setSelectedMed(prev => ({ ...prev, marketPrice: value }));
  };

  const addMedication = () => {
    if (!selectedMed) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const totalPrice = selectedMed.quantity * selectedMed.marketPrice;
    
    setMedications([
      ...medications,
      {
        ...selectedMed,
        time,
        totalPrice
      }
    ]);
    setSelectedMed(null);
    setSearchQuery('');
    message.success('Medication added');
  };

  const addNote = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotes([...notes, { time, action: newNote }]);
    setNewNote('');
  };

  const completeProcedure = () => {
    setStatus('Completed');
    message.success('Procedure completed');
  };

  return (
    <div className="minor-procedure-page">
      <Card title="Minor Procedure Documentation">
        <ProcedureInfo
          patient={{
            name: "Kwame Asare",
            id: "PT-78945"
          }}
          procedure={{
            type: "Tooth Extraction",
            tooth: "#36 (Lower Left Molar)",
            provider: "Dr. Yaa Mensah"
          }}
          status={status}
        />

        <div className="medication-section">
          <MedicationSearch
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onSelect={handleMedSelect}
            searchResults={searchResults || []}
            loading={loading}
          />

          {selectedMed && (
            <MedicationDisplay
              selectedMed={selectedMed}
              onQuantityChange={handleQuantityChange}
              onMarketPriceChange={handleMarketPriceChange}
            />
          )}

          {selectedMed && (
            <Button 
              type="primary" 
              onClick={addMedication}
              style={{ marginTop: 16 }}
            >
              Add Medication
            </Button>
          )}
        </div>

        <ProcedureNotes
          notes={notes}
          newNote={newNote}
          onNoteChange={(e) => setNewNote(e.target.value)}
          onAddNote={addNote}
        />

        <div className="actions">
          <Button danger>Cancel Procedure</Button>
          <Button 
            type="primary" 
            onClick={completeProcedure}
            disabled={status === 'Completed'}
          >
            Complete Procedure
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MinorProcedurePage;