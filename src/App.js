import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [characters, setCharacters] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', shortDescription: '', gender: '', role: '', currentLocation: '', accompaniedBy: '', specialDetails: '' 
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/characters').then(res => setCharacters(res.data)).catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://localhost:5000/api/characters/${editingId}`, formData).then(res => {
        setCharacters(characters.map(char => char._id === editingId ? res.data : char));
        resetForm();
      });
    } else {
      axios.post('http://localhost:5000/api/characters', formData).then(res => {
        setCharacters([...characters, res.data]);
        resetForm();
      });
    }
  };

  const deleteCharacter = (id) => {
    axios.delete(`http://localhost:5000/api/characters/${id}`).then(() => {
      setCharacters(characters.filter(char => char._id !== id));
    });
  };

  const loadCharacterIntoForm = (char, isEdit) => {
    setFormData({
      name: char.name,
      shortDescription: char.shortDescription,
      gender: char.gender,
      role: char.role,
      currentLocation: char.currentLocation,
      accompaniedBy: char.accompaniedBy.join(', '),
      specialDetails: char.specialDetails || ''
    });
    setEditingId(isEdit ? char._id : null); 
  };

  const resetForm = () => {
    setFormData({ name: '', shortDescription: '', gender: '', role: '', currentLocation: '', accompaniedBy: '', specialDetails: '' });
    setEditingId(null);
  };

  // Updated to Light Mode Professional Styling
  const inputStyle = { padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc', color: '#0f172a', outline: 'none', fontSize: '14px', transition: 'border 0.2s' };
  const btnStyle = { padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Segoe UI, system-ui, sans-serif', color: '#0f172a' }}>
      
      {/* Top Header / Project Title */}
      <div style={{ background: '#ffffff', padding: '20px 40px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: 0, fontSize: '22px', color: '#1e293b', fontWeight: '600' }}>
          Interactive Story Continuity and Entity Tracking Database
        </h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b' }}>System Control Dashboard</p>
      </div>

      <div style={{ padding: '30px 40px', display: 'flex', gap: '30px' }}>
        
        {/* Left Control Panel (Light Mode) */}
        <div style={{ width: '30%', background: '#ffffff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h2 style={{ borderBottom: '2px solid #2563eb', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: '#1e293b' }}>
            {editingId ? 'Edit Entity Record' : 'Create New Entity Record'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="Character Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={inputStyle}/>
            <input type="text" placeholder="Role (e.g., Protagonist)" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required style={inputStyle}/>
            <input type="text" placeholder="Gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required style={inputStyle}/>
            <input type="text" placeholder="Current Location" value={formData.currentLocation} onChange={(e) => setFormData({...formData, currentLocation: e.target.value})} required style={inputStyle}/>
            <input type="text" placeholder="Accompanied By (comma separated)" value={formData.accompaniedBy} onChange={(e) => setFormData({...formData, accompaniedBy: e.target.value})} required style={inputStyle}/>
            <input type="text" placeholder="Short Description" value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} required style={inputStyle}/>
            
            <textarea placeholder="Special Details / Plot Notes (Optional)" rows="4" value={formData.specialDetails} onChange={(e) => setFormData({...formData, specialDetails: e.target.value})} style={{...inputStyle, resize: 'vertical'}}/>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: editingId ? '#059669' : '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                {editingId ? 'Update Record' : 'Save to Database'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={{ padding: '12px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              )}
            </div>
          </form>
        </div>
        
        {/* Right Database View (Light Mode) */}
        <div style={{ width: '70%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', margin: 0, color: '#1e293b' }}>Active Entities ({characters.length})</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            
            {characters.map((char) => (
              <div key={char._id} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>{char.name}</h3>
                  <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', border: '1px solid #c7d2fe' }}>
                    {char.role}
                  </span>
                </div>
                
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#475569' }}>
                  {char.gender} • At: <strong style={{color: '#0f172a'}}>{char.currentLocation}</strong>
                </p>
                
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px', color: '#334155' }}>
                  <strong style={{ color: '#0f172a' }}>Accompanied By:</strong> {char.accompaniedBy.join(', ') || 'None'}
                </div>
                
                <p style={{ fontSize: '14px', marginBottom: '12px', color: '#334155', lineHeight: '1.5' }}>
                  {char.shortDescription}
                </p>
                
                {char.specialDetails && (
                  <div style={{ fontSize: '13px', color: '#92400e', background: '#fef3c7', padding: '10px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                    <strong>System Note:</strong> {char.specialDetails}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => loadCharacterIntoForm(char, true)} style={{ ...btnStyle, background: '#f1f5f9', color: '#3b82f6', border: '1px solid #bfdbfe' }}>Edit</button>
                  <button onClick={() => loadCharacterIntoForm(char, false)} style={{ ...btnStyle, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Copy</button>
                  <button onClick={() => deleteCharacter(char._id)} style={{ ...btnStyle, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', marginLeft: 'auto' }}>Delete</button>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;