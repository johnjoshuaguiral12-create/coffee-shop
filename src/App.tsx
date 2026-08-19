/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerApp from './pages/CustomerApp';
import AdminApp from './pages/AdminApp';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
