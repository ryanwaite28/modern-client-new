import { PlainObject } from "projects/common/src/app/interfaces/json-object.interface";

export enum AUTO_SERVICE_ACTION_TYPES {
  MAINTENANCE = 'MAINTENANCE',
  FIX = 'FIX',
  REPAIR = 'REPAIR',
  REPLACE = 'REPLACE',
  REMOVE = 'REMOVE',
  INSTALL = 'INSTALL',
  INSPECT = 'INSPECT',
  OTHER = 'OTHER',
}

export const service_action_types = Object.keys(AUTO_SERVICE_ACTION_TYPES);

export const standard_services = [
  `30/60/90/120 Mile Services`,
  `Brake Repair & Antilock Braking System Repair`,
  `Chassis & Suspension Repair`,
  `Check Engine Light Diagnostics & Repair`,
  `Computer Diagnostics`,
  `Factory Scheduled Maintenance`,
  `Filter Replacements`,
  `Fluid Services`,
  `Maintenance Inspections`,
  `Oil Changes`,
  `Shocks & Struts Repair`,
  `Suspension & Steering Repair`,
  `Trip Inspections`,
  `Tune Ups`,
  `Windshield Wiper Blades`,
];

export const engine_services = [
  `Belt Replacement`,
  `Cooling System Repair`,
  `Drivability Diagnostics & Repair`,
  `Engine Repair`,
  `Engine Replacement`,
  `Engine Performance Check`,
  `Fuel Injection Repair & Service`,
  `Fuel System Repair & Maintenance`,
  `Hose Replacement`,
  `Ignition System Repair & Maintenance`,
  `Radiator Repair & Replacement`,
  `Water Pump Repair & Replacement`,
];

export const exhaust_services = [
  `Catalytic Converter Repair`,
  `Exhaust Repair & Replacement`,
  `Exhaust Manifold Repair`,
  `Muffler Repair & Replacement`,
  `Tailpipe Repair & Replacement`,
];

export const heating_ac_services = [
  `Belt Repair & Replacement`,
  `Compressor Repair & Replacement`,
  `Evaporator Repair & Replacement`,
  `Heating & Cooling System Diagnostics`,
  `Heating System Repair & Service`,
  `Refrigerant Replacement`,
];

export const auto_electrical_services = [
  `Alternator Repair & Replacement`,
  `Electrical System Diagnostics & Repair`,
  `Power Antenna Repair`,
  `Check Engine Light Diagnostics & Repair`,
  `Light Repair & Bulb Replacements`,
  `Power Accessory Repair`,
  `Power Lock Repair`,
  `Power Steering Repair`,
  `Power Window Repair`,
  `Windshield Wiper Repair`,
];

export const transmission_services = [
  `Axle Repair & Replacement`,
  `Clutch Repair & Replacement`,
  `Differential Diagnosis`,
  `Differential Rebuild & Service`,
  `Driveline Repair & Maintenance`,
  `Driveshaft & U-Joint Repair`,
  `Flywheel Repair & Replacement`,
  `Transmission Fluid Service`,
  `Transmission Flush`,
  `Transmission Repair & Service`,
  `Transmission Replacement`,
];

export const fleet_services = [
  `Factory Scheduled Maintenance`,
  `Preventative Maintenance`,
  `Pre-Purchase Inspections`,
  `Fleet Accounts`,
];

export const tire_services = [
  `Tire Balancing`,
  `Tire Installations`,
  `Tire Replacement`,
  `Tire Rotation`,
  `Wheel Alignment`,
];


export const all_services = [
  ...standard_services,
  ...engine_services,
  ...exhaust_services,
  ...heating_ac_services,
  ...auto_electrical_services,
  ...transmission_services,
  ...fleet_services,
  ...tire_services,
];

export const service_categories = [
  { display: 'Standard Services', key: 'standard_services' },
  { display: 'Engine Services', key: 'engine_services' },
  { display: 'Exhaust services', key: 'exhaust_services' },
  { display: 'Heating AC Services', key: 'heating_ac_services' },
  { display: 'Auto Electrical Services', key: 'auto_electrical_services' },
  { display: 'Transmission Services', key: 'transmission_services' },
  { display: 'Fleet Services', key: 'fleet_services' },
  { display: 'Tire Services', key: 'tire_services' },
];

export const service_types_by_service_category = Object.freeze({
  standard_services,
  engine_services,
  exhaust_services,
  heating_ac_services,
  auto_electrical_services,
  transmission_services,
  fleet_services,
  tire_services,
}) as PlainObject;

export const all_services_map = all_services.reduce((obj, service: string) => {
  obj[service] = true;
  return obj;
}, {} as PlainObject);