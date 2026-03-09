import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import QRDownloadPanel from './QRDownloadPanel';
import '../styles/QRGeneratorWidget.css';

const SIZE_PRESETS = [
  { label: 'Small', description: 'Keychain / Sticker', pixels: 128 },
  { label: 'Medium', description: 'Bag Tag', pixels: 256 },
  { label: 'Large', description: 'Poster', pixels: 512 },
];

const UNIT_OPTIONS = [
  { label: 'Pixels', key: 'px' },
  { label: 'Centimeters', key: 'cm' },
  { label: 'Inches', key: 'in' },
];

function QRGeneratorWidget({ itemId, itemName }) {
  const [selectedPreset, setSelectedPreset] = useState(1);
  const [customSize, setCustomSize] = useState('');
  const [customUnit, setCustomUnit] = useState('px');
  const [showLabel, setShowLabel] = useState(true);

  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://QRetrieve.arsh-io.website';
  const qrValue = `${baseUrl}/found/${itemId}`;

  const getPixelSize = () => {
    if (customSize && Number(customSize) > 0) {
      const val = Number(customSize);
      if (customUnit === 'cm') return Math.round(val * 37.8);
      if (customUnit === 'in') return Math.round(val * 96);
      return val;
    }
    return SIZE_PRESETS[selectedPreset].pixels;
  };

  const pixelSize = getPixelSize();
  const previewSize = Math.min(pixelSize, 300);

  return (
    <div className="qr-widget card">
      <h3 className="qr-widget-title">QR Code for {itemName}</h3>

      <div className="qr-widget-body">
        {/* Live QR Preview */}
        <div className="qr-preview-container">
          <div className="qr-preview-card">
            <QRCodeSVG
              value={qrValue}
              size={previewSize}
              level="H"
              fgColor="#1a1a2e"
              bgColor="#ffffff"
              includeMargin
            />
            {showLabel && (
              <p className="qr-label">Scan to return via QRetrieve</p>
            )}
          </div>
          <p className="qr-dimensions">{pixelSize} x {pixelSize} px</p>
        </div>

        {/* Size Controls */}
        <div className="qr-controls">
          <div className="control-section">
            <h4 className="control-heading">Size Preset</h4>
            <div className="size-presets">
              {SIZE_PRESETS.map((preset, i) => (
                <button
                  key={preset.label}
                  className={`preset-btn ${selectedPreset === i ? 'active' : ''}`}
                  onClick={() => { setSelectedPreset(i); setCustomSize(''); }}
                >
                  <span className="preset-label">{preset.label}</span>
                  <span className="preset-desc">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h4 className="control-heading">Custom Size</h4>
            <div className="custom-size-row">
              <input
                type="number"
                className="form-control custom-size-input"
                placeholder="Size"
                value={customSize}
                min="32"
                max="4096"
                onChange={(e) => setCustomSize(e.target.value)}
              />
              <div className="unit-selector">
                {UNIT_OPTIONS.map((u) => (
                  <button
                    key={u.key}
                    className={`unit-btn ${customUnit === u.key ? 'active' : ''}`}
                    onClick={() => setCustomUnit(u.key)}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="control-section">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showLabel}
                onChange={(e) => setShowLabel(e.target.checked)}
              />
              <span>Show label under QR</span>
            </label>
          </div>

          <QRDownloadPanel
            itemId={itemId}
            itemName={itemName}
            qrValue={qrValue}
            size={pixelSize}
            showLabel={showLabel}
          />
        </div>
      </div>
    </div>
  );
}

export default QRGeneratorWidget;
