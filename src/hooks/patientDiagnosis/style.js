import { Card, Tag } from 'antd';

// Styled components
export const DiagnosisCardStyled = Card;
export const StatusTag = Tag;

// Style constants
export const styles = {
  card: {
    marginBottom: 16,
    borderRadius: 12,
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  confirmedCard: {
    borderLeft: '4px solid #52c41a',
    background: 'linear-gradient(90deg, rgba(82,196,26,0.05) 0%, rgba(255,255,255,1) 100%)'
  },
  provisionalCard: {
    borderLeft: '4px solid #fa8c16',
    background: 'linear-gradient(90deg, rgba(250,140,22,0.05) 0%, rgba(255,255,255,1) 100%)'
  },
  mainCard: {
    borderRadius: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: 'none'
  }
};