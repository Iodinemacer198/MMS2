const fs = require('fs');
const { AttachmentBuilder } = require('discord.js');

const planes = [
    { man: 'Boeing', name: '747', imageFile: './planes/747.jpeg' },
    { man: 'Boeing', name: '747', imageFile: './planes/7472.jpg' },
    { man: 'Boeing', name: '747', imageFile: './planes/7473.jpg' },
    { man: 'Airbus', name: 'A380', imageFile: './planes/a380.jpg' },
    { man: 'Airbus', name: 'A380', imageFile: './planes/a3802.jpg' },
    { man: 'Airbus', name: 'A380', imageFile: './planes/a3803.jpg' },
    { man: 'BAC/Aérospatiale', name: 'Concorde', imageFile: './planes/concorde.jpg' },
    { man: 'BAC/Aérospatiale', name: 'Concorde', imageFile: './planes/concorde2.jpeg' },
    { man: 'BAC/Aérospatiale', name: 'Concorde', imageFile: './planes/concorde3.jpeg' },
    { man: 'Airbus', name: 'A220', imageFile: './planes/a220.jpg' },
    { man: 'Airbus', name: 'A220', imageFile: './planes/a2202.jpg' },
    { man: 'Airbus', name: 'A220', imageFile: './planes/a2203.jpg' },
    { man: 'Boeing', name: '737', imageFile: './planes/737.jpg' },
    { man: 'Boeing', name: '737', imageFile: './planes/7372.jpeg' },
    { man: 'Boeing', name: '737', imageFile: './planes/7373.jpg' },
    { man: 'Embraer', name: '190', imageFile: './planes/e190.jpg' },
    { man: 'Embraer', name: '190', imageFile: './planes/e1902.jpeg' },
    { man: 'Embraer', name: '190', imageFile: './planes/e1903.jpg' },
    { man: 'DeHavilland', name: 'Dash 8', imageFile: './planes/q400.jpg' },
    { man: 'DeHavilland', name: 'Dash 8', imageFile: './planes/q4002.jpg' },
    { man: 'DeHavilland', name: 'Dash 8', imageFile: './planes/q4003.jpeg' },
    { man: 'Airbus', name: 'A350', imageFile: './planes/a350.jpg' },
    { man: 'Airbus', name: 'A350', imageFile: './planes/a3502.jpg' },
    { man: 'Airbus', name: 'A350', imageFile: './planes/a3503.jpg' },
    { man: 'Boeing', name: '707', imageFile: './planes/707.jpg' },
    { man: 'Boeing', name: '707', imageFile: './planes/7072.jpg' },
    { man: 'Boeing', name: '707', imageFile: './planes/7073.jpg' },
    { man: 'Airbus', name: 'A340', imageFile: './planes/a340.jpg' },
    { man: 'Airbus', name: 'A340', imageFile: './planes/a3402.jpg' },
    { man: 'Airbus', name: 'A340', imageFile: './planes/a3403.jpg' },
    { man: 'Boeing', name: '767', imageFile: './planes/767.jpg' },
    { man: 'Boeing', name: '767', imageFile: './planes/7672.jpeg' },
    { man: 'Boeing', name: '767', imageFile: './planes/7673.png' },
    { man: 'Boeing', name: '777', imageFile: './planes/777.jpeg' },
    { man: 'Boeing', name: '777', imageFile: './planes/7772.jpg' },
    { man: 'Boeing', name: '777', imageFile: './planes/7773.jpeg' },
    { man: 'Boeing', name: '787', imageFile: './planes/787.jpg' },
    { man: 'Boeing', name: '787', imageFile: './planes/7872.jpeg' },
    { man: 'Boeing', name: '787', imageFile: './planes/7873.jpg' },
    { man: 'Boeing', name: '727', imageFile: './planes/727.jpg' },
    { man: 'Boeing', name: '727', imageFile: './planes/7272.jpg' },
    { man: 'Boeing', name: '727', imageFile: './planes/7273.jpg' },
    { man: 'Airbus', name: 'A320', imageFile: './planes/a320.jpg' },
    { man: 'Airbus', name: 'A320', imageFile: './planes/a3202.jpg' },
    { man: 'Airbus', name: 'A320', imageFile: './planes/a3203.jpg' },
    { man: 'Airbus', name: 'A310', imageFile: './planes/a310.jpg' },
    { man: 'Airbus', name: 'A310', imageFile: './planes/a3102.jpg' },
    { man: 'Airbus', name: 'A310', imageFile: './planes/a3103.jpg' },
    { man: 'Airbus', name: 'A300', imageFile: './planes/a300.jpg' },
    { man: 'Airbus', name: 'A300', imageFile: './planes/a3002.jpg' },
    { man: 'Airbus', name: 'A300', imageFile: './planes/a3003.jpg' },
    { man: 'Airbus', name: 'A330', imageFile: './planes/a330.jpg' },
    { man: 'Airbus', name: 'A330', imageFile: './planes/a3302.jpg' },
    { man: 'Airbus', name: 'A330', imageFile: './planes/a3303.jpg' },
    { man: 'Boeing', name: '757', imageFile: './planes/757.jpg' },
    { man: 'Boeing', name: '757', imageFile: './planes/7572.jpg' },
    { man: 'Boeing', name: '757', imageFile: './planes/7573.jpg' },
    { man: 'Boeing', name: '717', imageFile: './planes/717.jpg' },
    { man: 'Boeing', name: '717', imageFile: './planes/7172.jpeg' },
    { man: 'Boeing', name: '717', imageFile: './planes/7173.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-11', imageFile: './planes/md11.jpeg' },
    { man: 'McDonnell Douglas', name: 'MD-11', imageFile: './planes/md112.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-11', imageFile: './planes/md113.jpg' },
    { man: 'Lockheed', name: 'L-1011', imageFile: './planes/l1011.jpg' },
    { man: 'Lockheed', name: 'L-1011', imageFile: './planes/l10112.jpg' },
    { man: 'Lockheed', name: 'L-1011', imageFile: './planes/l10113.jpg' },
    { man: 'Cessna', name: '172', imageFile: './planes/c172.jpg' },
    { man: 'Cessna', name: '172', imageFile: './planes/c1722.jpg' },
    { man: 'Cessna', name: '172', imageFile: './planes/c1723.jpeg' },
    { man: 'Cirrus', name: 'Vision Jet', imageFile: './planes/visionjet.png' },
    { man: 'Cirrus', name: 'Vision Jet', imageFile: './planes/visionjet2.jpg' },
    { man: 'Cirrus', name: 'Vision Jet', imageFile: './planes/visionjet3.jpg' },
    { man: 'Douglas', name: 'DC-8', imageFile: './planes/dc8.jpg' },
    { man: 'Douglas', name: 'DC-8', imageFile: './planes/dc82.jpeg' },
    { man: 'Douglas', name: 'DC-8', imageFile: './planes/dc83.jpg' },
    { man: 'Douglas', name: 'DC-9', imageFile: './planes/dc9.jpg' },
    { man: 'Douglas', name: 'DC-9', imageFile: './planes/dc92.jpg' },
    { man: 'Douglas', name: 'DC-9', imageFile: './planes/dc93.jpg' },
    { man: 'Fokker', name: '100', imageFile: './planes/f100.jpg' },
    { man: 'Fokker', name: '100', imageFile: './planes/f1002.jpg' },
    { man: 'Fokker', name: '100', imageFile: './planes/f1003.jpg' },
    { man: 'Embraer', name: 'ERJ-145', imageFile: './planes/erj145.jpg' },
    { man: 'Embraer', name: 'ERJ-145', imageFile: './planes/erj1452.jpg' },
    { man: 'Embraer', name: 'ERJ-145', imageFile: './planes/erj1453.jpg' },
    { man: 'Comac', name: 'C919', imageFile: './planes/c919.png' },
    { man: 'Comac', name: 'C919', imageFile: './planes/c9192.jpeg' },
    { man: 'Comac', name: 'C919', imageFile: './planes/c9193.jpg' },
    { man: 'DeHavilland', name: 'Comet', imageFile: './planes/comet.jpg' },
    { man: 'DeHavilland', name: 'Comet', imageFile: './planes/comet2.png' },
    { man: 'DeHavilland', name: 'Comet', imageFile: './planes/comet3.jpeg' },
    { man: 'Ilyushin', name: 'Il-62', imageFile: './planes/il62.jpg' },
    { man: 'Ilyushin', name: 'Il-62', imageFile: './planes/il622.jpg' },
    { man: 'Ilyushin', name: 'Il-62', imageFile: './planes/il623.jpg' },
    { man: 'Ilyushin', name: 'Il-62', imageFile: './planes/il62.jpg' },
    { man: 'Bombardier', name: 'CRJ-700', imageFile: './planes/crj7.jpg' },
    { man: 'Bombardier', name: 'CRJ-700', imageFile: './planes/crj72.jpg' },
    { man: 'Bombardier', name: 'CRJ-700', imageFile: './planes/crj73.jpg' },
    { man: 'Bombardier', name: 'CRJ-200', imageFile: './planes/crj2.jpg' },
    { man: 'Bombardier', name: 'CRJ-200', imageFile: './planes/crj22.jpg' },
    { man: 'Bombardier', name: 'CRJ-200', imageFile: './planes/crj23.jpg' },
    { man: 'Bombardier', name: 'CRJ-900', imageFile: './planes/crj9.jpeg' },
    { man: 'Bombardier', name: 'CRJ-900', imageFile: './planes/crj92.jpg' },
    { man: 'Bombardier', name: 'CRJ-900', imageFile: './planes/crj93.jpg' },
    { man: 'Tupolev', name: 'Tu-154', imageFile: './planes/tu154.jpg' },
    { man: 'Tupolev', name: 'Tu-154', imageFile: './planes/tu1542.jpg' },
    { man: 'Tupolev', name: 'Tu-154', imageFile: './planes/tu1543.jpg' },
    { man: 'Tupolev', name: 'Tu-144', imageFile: './planes/tu144.jpg' },
    { man: 'Tupolev', name: 'Tu-144', imageFile: './planes/tu1442.jpg' },
    { man: 'Vickers', name: 'VC10', imageFile: './planes/vc10.jpg'},
    { man: 'Vickers', name: 'VC10', imageFile: './planes/vc102.jpeg'},
    { man: 'Vickers', name: 'VC10', imageFile: './planes/vc103.jpg'},
    { man: 'Comac', name: 'ARJ21', imageFile: './planes/arj21.jpg'},
    { man: 'Comac', name: 'ARJ21', imageFile: './planes/arj212.jpg'},
    { man: 'Comac', name: 'ARJ21', imageFile: './planes/arj213.png'},
    { man: 'Airbus', name: 'Beluga', imageFile: './planes/beluga.jpg' },
    { man: 'Airbus', name: 'Beluga', imageFile: './planes/beluga2.jpg' },
    { man: 'Airbus', name: 'Beluga', imageFile: './planes/beluga3.jpg' },
    { man: 'Douglas', name: 'DC-3', imageFile: './planes/dc3.jpg' },
    { man: 'Douglas', name: 'DC-3', imageFile: './planes/dc32.jpg' },
    { man: 'Douglas', name: 'DC-3', imageFile: './planes/dc33.jpg' },
    { man: 'Boeing', name: 'Dreamlifter', imageFile: './planes/dreamlifter.jpg' },
    { man: 'Boeing', name: 'Dreamlifter', imageFile: './planes/dreamlifter2.jpg' },
    { man: 'Boeing', name: 'Dreamlifter', imageFile: './planes/dreamlifter3.jpg' },
    { man: 'Ilyushin', name: 'Il-96', imageFile: './planes/il96.jpg' },
    { man: 'Ilyushin', name: 'Il-96', imageFile: './planes/il962.jpeg' },
    { man: 'Ilyushin', name: 'Il-96', imageFile: './planes/il963.jpg' },
    { man: 'Bombardier', name: 'Learjet 45', imageFile: './planes/learjet45.jpg' },
    { man: 'Bombardier', name: 'Learjet 45', imageFile: './planes/learjet452.jpg' },
    { man: 'Bombardier', name: 'Learjet 45', imageFile: './planes/learjet453.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-80', imageFile: './planes/md80.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-80', imageFile: './planes/md802.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-80', imageFile: './planes/md803.jpg' },
    { man: 'BAE Systems', name: 'RJ-85', imageFile: './planes/rj85.jpg' },
    { man: 'BAE Systems', name: 'RJ-85', imageFile: './planes/rj852.jpg' },
    { man: 'BAE Systems', name: 'RJ-85', imageFile: './planes/rj853.jpg' },
    { man: 'Sukhoi', name: 'SSJ-100', imageFile: './planes/ssj100.jpg' },
    { man: 'Sukhoi', name: 'SSJ-100', imageFile: './planes/ssj1002.jpg' },
    { man: 'Sukhoi', name: 'SSJ-100', imageFile: './planes/ssj1003.jpeg' },
]

const hardplanes = [
    { man: 'Boeing', name: '747-8', imageFile: './planes/747.jpeg' },
    { man: 'Boeing', name: '747-100', imageFile: './planes/7472.jpg' },
    { man: 'Boeing', name: '747-400', imageFile: './planes/7473.jpg' },
    { man: 'Airbus', name: 'A380-800', imageFile: './planes/a380.jpg' },
    { man: 'Airbus', name: 'A380-800', imageFile: './planes/a3802.jpg' },
    { man: 'Airbus', name: 'A380-800', imageFile: './planes/a3803.jpg' },
    { man: 'BAC/Aérospatiale', name: 'Concorde', imageFile: './planes/concorde.jpg' },
    { man: 'BAC/Aérospatiale', name: 'Concorde', imageFile: './planes/concorde2.jpeg' },
    { man: 'BAC/Aérospatiale', name: 'Concorde', imageFile: './planes/concorde3.jpeg' },
    { man: 'Airbus', name: 'A220-300', imageFile: './planes/a220.jpg' },
    { man: 'Airbus', name: 'A220-300', imageFile: './planes/a2202.jpg' },
    { man: 'Airbus', name: 'A220-300', imageFile: './planes/a2203.jpg' },
    { man: 'Boeing', name: '737-800', imageFile: './planes/737.jpg' },
    { man: 'Boeing', name: '737 MAX 8', imageFile: './planes/7372.jpeg' },
    { man: 'Boeing', name: '737 MAX 8', imageFile: './planes/7373.jpg' },
    { man: 'Boeing', name: '737-200', imageFile: './planes/7374.jpeg' },
    { man: 'Boeing', name: '737-500', imageFile: './planes/7375.jpeg' },
    { man: 'Embraer', name: '190-100', imageFile: './planes/e190.jpg' },
    { man: 'Embraer', name: '190-200', imageFile: './planes/e1902.jpeg' },
    { man: 'Embraer', name: '190-E2', imageFile: './planes/e1903.jpg' },
    { man: 'DeHavilland', name: 'Q400', imageFile: './planes/q400.jpg' },
    { man: 'DeHavilland', name: 'Q400', imageFile: './planes/q4002.jpg' },
    { man: 'DeHavilland', name: 'Q400', imageFile: './planes/q4003.jpeg' },
    { man: 'Airbus', name: 'A350-900', imageFile: './planes/a350.jpg' },
    { man: 'Airbus', name: 'A350-1000', imageFile: './planes/a3502.jpg' },
    { man: 'Airbus', name: 'A350-900', imageFile: './planes/a3503.jpg' },
    { man: 'Boeing', name: '707-120', imageFile: './planes/707.jpg' },
    { man: 'Boeing', name: '707-120', imageFile: './planes/7072.jpg' },
    { man: 'Boeing', name: '707-220', imageFile: './planes/7073.jpg' },
    { man: 'Airbus', name: 'A340-600', imageFile: './planes/a340.jpg' },
    { man: 'Airbus', name: 'A340-300', imageFile: './planes/a3402.jpg' },
    { man: 'Airbus', name: 'A340-300', imageFile: './planes/a3403.jpg' },
    { man: 'Boeing', name: '767-300', imageFile: './planes/767.jpg' },
    { man: 'Boeing', name: '767-300F', imageFile: './planes/7672.jpeg' },
    { man: 'Boeing', name: '767-300', imageFile: './planes/7673.png' },
    { man: 'Boeing', name: '777-200', imageFile: './planes/777.jpeg' },
    { man: 'Boeing', name: '777-300ER', imageFile: './planes/7772.jpg' },
    { man: 'Boeing', name: '777-200ER', imageFile: './planes/7773.jpeg' },
    { man: 'Boeing', name: '787-9', imageFile: './planes/787.jpg' },
    { man: 'Boeing', name: '787-9', imageFile: './planes/7872.jpeg' },
    { man: 'Boeing', name: '787-9', imageFile: './planes/7873.jpg' },
    { man: 'Boeing', name: '727-200', imageFile: './planes/727.jpg' },
    { man: 'Boeing', name: '727-100', imageFile: './planes/7272.jpg' },
    { man: 'Boeing', name: '727-200', imageFile: './planes/7273.jpg' },
    { man: 'Airbus', name: 'A320-200', imageFile: './planes/a320.jpg' },
    { man: 'Airbus', name: 'A320-200', imageFile: './planes/a3202.jpg' },
    { man: 'Airbus', name: 'A320-200', imageFile: './planes/a3203.jpg' },
    { man: 'Airbus', name: 'A310-300', imageFile: './planes/a310.jpg' },
    { man: 'Airbus', name: 'A310-300', imageFile: './planes/a3102.jpg' },
    { man: 'Airbus', name: 'A310-300', imageFile: './planes/a3103.jpg' },
    { man: 'Airbus', name: 'A300-600F', imageFile: './planes/a300.jpg' },
    { man: 'Airbus', name: 'A300-600', imageFile: './planes/a3002.jpg' },
    { man: 'Airbus', name: 'A300-600F', imageFile: './planes/a3003.jpg' },
    { man: 'Airbus', name: 'A330-300', imageFile: './planes/a330.jpg' },
    { man: 'Airbus', name: 'A330-200', imageFile: './planes/a3302.jpg' },
    { man: 'Airbus', name: 'A330-300', imageFile: './planes/a3303.jpg' },
    { man: 'Boeing', name: '757-200', imageFile: './planes/757.jpg' },
    { man: 'Boeing', name: '757-300', imageFile: './planes/7572.jpg' },
    { man: 'Boeing', name: '757-200', imageFile: './planes/7573.jpg' },
    { man: 'Boeing', name: '717-200', imageFile: './planes/717.jpg' },
    { man: 'Boeing', name: '717-200', imageFile: './planes/7172.jpeg' },
    { man: 'Boeing', name: '717-200', imageFile: './planes/7173.jpg' },
    { man: 'Lockheed', name: 'L-1011-300', imageFile: './planes/l1011.jpg' },
    { man: 'Lockheed', name: 'L-1011-100', imageFile: './planes/l10112.jpg' },
    { man: 'Lockheed', name: 'L-1011-100', imageFile: './planes/l10113.jpg' },
    { man: 'Bombardier', name: 'CRJ-700', imageFile: './planes/crj7.jpg' },
    { man: 'Bombardier', name: 'CRJ-700', imageFile: './planes/crj72.jpg' },
    { man: 'Bombardier', name: 'CRJ-700', imageFile: './planes/crj73.jpg' },
    { man: 'Bombardier', name: 'CRJ-200', imageFile: './planes/crj2.jpg' },
    { man: 'Bombardier', name: 'CRJ-200', imageFile: './planes/crj22.jpg' },
    { man: 'Bombardier', name: 'CRJ-200', imageFile: './planes/crj23.jpg' },
    { man: 'Bombardier', name: 'CRJ-900', imageFile: './planes/crj9.jpeg' },
    { man: 'Bombardier', name: 'CRJ-900', imageFile: './planes/crj92.jpg' },
    { man: 'Bombardier', name: 'CRJ-900', imageFile: './planes/crj93.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-80', imageFile: './planes/md80.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-82', imageFile: './planes/md802.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-87', imageFile: './planes/md803.jpg' },
]

const planes2 = [
    { man: 'Airbus', name: 'A3', imageFile: './planes/a3.jpg'},
    { man: 'Airbus', name: 'A390', imageFile: './planes/a390.jpg'},
    { man: 'Airbus', name: 'A370', imageFile: './planes/a370.png'},
    { man: 'Airbus', name: 'Honker', imageFile: './planes/honker.jpg'},
    { man: 'Boeing', name: '7777', imageFile: './planes/7777.jpeg'},
    { man: 'Boeing', name: '744447', imageFile: './planes/744447.jpg'},
    { man: 'Boeing', name: 'Battery Plane', imageFile: './planes/electricplane.jpg'},
    { man: 'McDonnell Douglas', name: 'MD-11BE', imageFile: './planes/mdbe.jpg'},
    { man: 'Boeing', name: 'Wiggle Plane', imageFile: './planes/wiggle.jpeg'},
]

const military = [
    { man: 'General Dynamics', alt: 'Falcon', name: 'F-16', imageFile: './planes/f16.jpg'},
    { man: 'Lockheed Martin', alt: 'Raptor', name: 'F-22', imageFile: './planes/f22.jpg'},
    { man: 'McDonnell Douglas', alt: 'Eagle', name: 'F-15', imageFile: './planes/f15.jpg'},
    { man: 'Eurofighter', alt: 'Eurofighter', name: 'Typhoon', imageFile: './planes/typhoon.jpg'},
    { man: 'Mikoyan-Gurevich', alt: 'Foxbat', name: 'MiG-25', imageFile: './planes/mig25.jpg'},
    { man: 'Mikoyan-Gurevich', alt: 'Fagot', name: 'MiG-15', imageFile: './planes/mig15.jpg'},
    { man: 'Mikoyan-Gurevich', alt: 'Fulcrum', name: 'MiG-29', imageFile: './planes/mig29.jpg'},
    { man: 'Mikoyan-Gurevich', alt: 'Fishbed', name: 'MiG-21', imageFile: './planes/mig21.jpg'},
    { man: 'Grumman', alt: 'Tomcat', name: 'F-14', imageFile: './planes/f14.jpg'},
    { man: 'Boeing', alt: 'Hornet', name: 'F-18', imageFile: './planes/f18.jpg'},
    { man: 'Lockheed Martin', alt: 'Lightning', name: 'F-35', imageFile: './planes/f35.jpg'},
    { man: 'Northrop', alt: 'Tiger', name: 'F-5', imageFile: './planes/f5.jpg'},
    { man: 'McDonnell Douglas', alt: 'Phantom', name: 'F-4', imageFile: './planes/f4.jpg'},
    { man: 'Sukhoi', alt: 'Flanker', name: 'Su-27', imageFile: './planes/su27.jpg'},
    { man: 'Sukhoi', alt: 'Felon', name: 'Su-57', imageFile: './planes/su57.jpg'},
    { man: 'Fairchild Republic', alt: 'Warthog', name: 'A-10', imageFile: './planes/a10.jpg'},
    { man: 'Lockheed', alt: 'Starfighter', name: 'F-104', imageFile: './planes/f104.jpg'},
    { man: 'Northrop', alt: 'Black Widow', name: 'YF-23', imageFile: './planes/yf23.jpg'},
    { man: 'Boeing', alt: 'Sentry', name: 'E-3', imageFile: './planes/e3.jpg'},
    { man: 'Rockwell', alt: 'Lancer', name: 'B-1', imageFile: './planes/b1.jpg'},
    { man: 'Northrop', alt: 'Spirit', name: 'B-2', imageFile: './planes/b2.jpg'},
    { man: 'Boeing', alt: 'Stratofortress', name: 'B-52', imageFile: './planes/b52.jpg'},
    { man: 'McDonnell Douglas', alt: 'Harrier', name: 'AV-8', imageFile: './planes/av8.jpg'},
    { man: 'Lockheed', alt: 'Nighthawk', name: 'F-117', imageFile: './planes/f117.jpg'},
    { man: 'Lockheed Martin', alt: 'Hercules', name: 'C-130', imageFile: './planes/c130.jpg'},
    { man: 'Boeing', alt: 'Globemaster', name: 'C-17', imageFile: './planes/c17.jpg'},
    { man: 'Dassault', alt: 'B', name: 'Rafale', imageFile: './planes/rafale.jpg'},
    { man: 'Bell Boeing', alt: 'Osprey', name: 'V-22', imageFile: './planes/v22.jpg'},
    { man: 'Bell', alt: 'Huey', name: 'UH-1', imageFile: './planes/huey.jpg'},
    { man: 'Northrop Grumman', alt: 'Raider', name: 'B-21', imageFile: './planes/b21.jpg'},
    { man: 'Boeing', alt: 'Doomsday', name: 'E-4b', imageFile: './planes/e4.jpg'},
    { man: 'McDonnell Douglas', alt: 'Extender', name: 'KC-10', imageFile: './planes/kc10.jpg'},
    { man: 'Boeing', alt: 'Stratotanker', name: 'KC-135', imageFile: './planes/kc135.jpg'},
    { man: 'Lockheed', alt: 'Dragon Lady', name: 'U-2', imageFile: './planes/u2.jpg'},
    { man: 'Boeing', alt: 'Poseidon', name: 'P-8', imageFile: './planes/p8.jpg'},
    { man: 'General Atomics', alt: 'Reaper', name: 'MQ-9', imageFile: './planes/mq9.jpg'},
    { man: 'General Atomics', alt: 'Predator', name: 'MQ-1', imageFile: './planes/mq1.jpg'},
    { man: 'Convair', alt: 'Delta Dart', name: 'F-106', imageFile: './planes/f106.jpg'},
    { man: 'Republic', alt: 'Thunderchief', name: 'F-105', imageFile: './planes/f105.jpg'},
    { man: 'Vought', alt: 'Crusader', name: 'F-8', imageFile: './planes/f8.jpg'},
    { man: 'North American', alt: 'Super Sabre', name: 'F-100', imageFile: './planes/f100.webp'},
    { man: 'North American', alt: 'Sabre', name: 'F-86', imageFile: './planes/f86.jpg'},
    { man: 'Messerschmitt', alt: 'Schwalbe', name: 'Me 262', imageFile: './planes/me262.jpg'},
    { man: 'Panavia', alt: 'Tornado', name: 'GR-1', imageFile: './planes/tornado.jpg'},
    { man: 'Dassault', alt: '2000', name: 'Mirage', imageFile: './planes/mirage2.jpg'},
    { man: 'Shenyang', alt: 'Hidden Dragon', name: 'J-16', imageFile: './planes/j16.jpeg'},
    { man: 'Chengdu', alt: 'Mighty Dragon', name: 'J-20', imageFile: './planes/j20.jpg'},
    { man: 'Dassault', alt: 'F1', name: 'Mirage', imageFile: './planes/f1.webp'},
    { man: 'Dassault', alt: 'III', name: 'Mirage', imageFile: './planes/mirage3.jpg'},
    { man: 'Hawker', alt: 'Hunter', name: 'F.1', imageFile: './planes/hunter.jpg'},
    { man: 'Boeing', alt: 'Rivet Joint', name: 'RC-135', imageFile: './planes/rc135.png'},
]

const cool = [
    { man: 'Douglas', name: 'DC-3', imageFile: './planes/dc3.jpg' },
    { man: 'BAE Systems', name: 'Jetstream-41', imageFile: './planes/jetstream41.jpg' },
    { man: 'Embraer', name: 'EMB-120', imageFile: './planes/emb120.jpg' },
    { man: 'Dornier', name: '328-100', imageFile: './planes/d3281.jpg' },
    { man: 'Saab', name: '340B', imageFile: './planes/s340b.jpg' },
    { man: 'De Havilland', name: 'Q200', imageFile: './planes/q200.webp' },
    { man: 'ATR', name: '42-500', imageFile: './planes/atr425.webp' },
    { man: 'ATR', name: '42-600', imageFile: './planes/atr426.jpg' },
    { man: 'De Havilland', name: 'Q300', imageFile: './planes/q300.jpg' },
    { man: 'Embraer', name: 'ERJ-135', imageFile: './planes/erj135.jpg' },
    { man: 'Ilyushin', name: 'Il-114', imageFile: './planes/il114.webp' },
    { man: 'Embraer', name: 'ERJ-140', imageFile: './planes/erj140.jpg' },
    { man: 'ATR', name: '72-500', imageFile: './planes/atr725.webp' },
    { man: 'ATR', name: '72-600', imageFile: './planes/atr726.jpg' },
    { man: 'Bombardier', name: 'CRJ-200', imageFile: './planes/crj2.jpg' },
    { man: 'Embraer', name: 'ERJ-145', imageFile: './planes/erj145.jpg' },
    { man: 'Saab', name: '2000', imageFile: './planes/s2000.jpg' },
    { man: 'De Havilland', name: 'Q400', imageFile: './planes/q400.jpg' },
    { man: 'CASA/IPTN', name: 'CN-235', imageFile: './planes/cn235.jpg' },
    { man: 'Bombardier', name: 'CRJ-550', imageFile: './planes/crj550.jpg' },
    { man: 'Bombardier', name: 'CRJ-700', imageFile: './planes/crj7.jpg' },
    { man: 'Bombardier', name: 'CRJ-900', imageFile: './planes/crj9.jpeg' },
    { man: 'Fokker', name: '100', imageFile: './planes/f100.jpg' },
    { man: 'Bombardier', name: 'CRJ-1000', imageFile: './planes/crj10.jpg' },
    { man: 'BAE Systems', name: 'RJ-85', imageFile: './planes/rj85.jpg' },
    { man: 'Sud Aviation', name: 'Caravelle', imageFile: './planes/caravelle.jpg' },
    { man: 'Boeing', name: '727-100', imageFile: './planes/727100.jpg' },
    { man: 'Boeing', name: '727-200', imageFile: './planes/727200.jpg' },
    { man: 'Boeing', name: '737-300', imageFile: './planes/737300.jpg' },
    { man: 'Dassault', name: 'F900', imageFile: './planes/f900.jpg' },
    { man: 'Embraer', name: 'ERJ-145XR', imageFile: './planes/erj145xr.jpg' },
    { man: 'Embraer', name: 'E170', imageFile: './planes/erj170.jpg' },
    { man: 'Embraer', name: 'E175', imageFile: './planes/erj175.jpeg' },
    { man: 'Comac', name: 'ARJ21-700', imageFile: './planes/arj217.jpg' },
    { man: 'Sukhoi', name: 'SSJ-100', imageFile: './planes/ssj100.jpg' },
    { man: 'Boeing', name: '737-200', imageFile: './planes/7374.jpeg' },
    { man: 'Embraer', name: 'E190', imageFile: './planes/erj190.jpg' },
    { man: 'Embraer', name: 'E195', imageFile: './planes/erj195.jpg' },
    { man: 'Airbus', name: 'A220-100', imageFile: './planes/a2201.webp' },
    { man: 'Embraer', name: 'E190-E2', imageFile: './planes/erj190e2.webp' },
    { man: 'Boeing', name: '717-200', imageFile: './planes/717200.webp' },
    { man: 'Embraer', name: 'E195-E2', imageFile: './planes/e195e2.jpg' },
    { man: 'Boeing', name: '737-600', imageFile: './planes/737600.jpeg' },
    { man: 'Boeing', name: '737-500', imageFile: './planes/737500.jpeg' },
    { man: 'Airbus', name: 'A318-100', imageFile: './planes/a318.jpg' },
    { man: 'Boeing', name: '737-700', imageFile: './planes/737700.jpg' },
    { man: 'Tupolev', name: 'Tu-154', imageFile: './planes/tu154m.jpg' },
    { man: 'Douglas', name: 'DC-8-30', imageFile: './planes/dc830.jpg' },
    { man: 'Douglas', name: 'DC-8-10', imageFile: './planes/dc810.jpg' },
    { man: 'Douglas', name: 'DC-8-50', imageFile: './planes/dc850.jpg' },
    { man: 'Douglas', name: 'DC-9-10', imageFile: './planes/dc910.jpg' },
    { man: 'Douglas', name: 'DC-9-30', imageFile: './planes/dc930.jpg' },
    { man: 'Douglas', name: 'DC-9-40', imageFile: './planes/dc940.jpg' },
    { man: 'Airbus', name: 'A220-300', imageFile: './planes/a2203.webp' },
    { man: 'Boeing', name: '737-400', imageFile: './planes/737400.jpg' },
    { man: 'Boeing', name: '737-100', imageFile: './planes/737100.jpg' },
    { man: 'Airbus', name: 'A319-100', imageFile: './planes/a319.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-90', imageFile: './planes/md90.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-83', imageFile: './planes/md803n.jpg' },
    { man: 'Boeing', name: '737-800', imageFile: './planes/737800.jpg' },
    { man: 'Airbus', name: 'A320-200', imageFile: './planes/a320200.jpg' },
    { man: 'Boeing', name: '737-900ER', imageFile: './planes/737900er.jpeg' },
    { man: 'Comac', name: 'C919', imageFile: './planes/comc919.jpg' },
    { man: 'Airbus', name: 'A319neo', imageFile: './planes/a319neo.jpg' },
    { man: 'Airbus', name: 'A321-200', imageFile: './planes/a321200.jpg' },
    { man: 'Airbus', name: 'A320neo', imageFile: './planes/a320neo.jpeg' },
    { man: 'Boeing', name: '737 MAX 8', imageFile: './planes/737max8.jpg' },
    { man: 'Boeing', name: '737 MAX 8-200', imageFile: './planes/737max8200.jpeg' },
    { man: 'Boeing', name: '737 MAX 9', imageFile: './planes/737max9.webp' },
    { man: 'Airbus', name: 'A321neo', imageFile: './planes/a321neo.jpg' },
    { man: 'Airbus', name: 'A321neo-LR', imageFile: './planes/a321neoLR.jpg' },
    { man: 'Boeing', name: '757-300', imageFile: './planes/757300.jpeg' },
    { man: 'Airbus', name: 'A300-600', imageFile: './planes/a300600.jpg' },
    { man: 'BAC/Aérospatiale', name: 'Concorde', imageFile: './planes/concorde.jpg' },
    { man: 'Lockheed', name: 'Constellation', imageFile: './planes/constellationn.jpg' },
    { man: 'Gulfstream', name: 'G650', imageFile: './planes/g650.jpg' },
    { man: 'Boeing', name: '737-700ER', imageFile: './planes/737700er.jpg' },
    { man: 'Airbus', name: 'A319-100LR', imageFile: './planes/a319lr.jpg' },
    { man: 'Ilyushin', name: 'Il-96-300', imageFile: './planes/il96300.jpg' },
    { man: 'Boeing', name: '757-200', imageFile: './planes/757200.jpg' },
    { man: 'Boeing', name: '707-320', imageFile: './planes/707320.webp' },
    { man: 'Lockheed', name: 'L-1011-500', imageFile: './planes/l1011500.jpg' },
    { man: 'Lockheed', name: 'L-1011-200', imageFile: './planes/l1011200.jpg' },
    { man: 'Airbus', name: 'A310-300', imageFile: './planes/a310300.jpg' },
    { man: 'Boeing', name: '767-200ER', imageFile: './planes/767200er.png' },
    { man: 'Boeing', name: '767-300ER', imageFile: './planes/767300er.jpg' },
    { man: 'Boeing', name: '767-400ER', imageFile: './planes/767400er.jpeg' },
    { man: 'Boeing', name: '787-8', imageFile: './planes/7878.jpg' },
    { man: 'Airbus', name: 'A330-200', imageFile: './planes/a330200.webp' },
    { man: 'Airbus', name: 'A340-200', imageFile: './planes/a340200.jpeg' },
    { man: 'Boeing', name: '747-100', imageFile: './planes/747100.jpg' },
    { man: 'McDonnell Douglas', name: 'MD-11', imageFile: './planes/md11n.jpg' },
    { man: 'Boeing', name: '777-200', imageFile: './planes/777200.jpg' },
    { man: 'Airbus', name: 'A330-300', imageFile: './planes/a330300.jpg' },
    { man: 'Boeing', name: '787-9', imageFile: './planes/7879.webp' },
    { man: 'Ilyushin', name: 'Il-96M', imageFile: './planes/il96m.jpg' },
    { man: 'Airbus', name: 'A340-300', imageFile: './planes/a340300.webp' },
    { man: 'Boeing', name: '787-10', imageFile: './planes/78710.jpeg' },
    { man: 'Boeing', name: '777-200ER', imageFile: './planes/777200er.jpg' },
    { man: 'Airbus', name: 'A330-800neo', imageFile: './planes/a330800.webp' },
    { man: 'Boeing', name: '747-200', imageFile: './planes/747200.jpg' },
    { man: 'Airbus', name: 'A330-900neo', imageFile: './planes/a330900.jpg' },
    { man: 'Boeing', name: '747-300', imageFile: './planes/747300.jpg' },
    { man: 'Airbus', name: 'A340-500', imageFile: './planes/a340500.webp' },
    { man: 'Boeing', name: '777-300', imageFile: './planes/777300.jpg' },
    { man: 'Boeing', name: '777-200LR', imageFile: './planes/777200lr.jpg' },
    { man: 'Airbus', name: 'A340-600', imageFile: './planes/a340600.webp' },
    { man: 'Airbus', name: 'A350-900XWB', imageFile: './planes/a350900xwb.jpg' },
    { man: 'Boeing', name: '747-400', imageFile: './planes/747400.jpg' },
    { man: 'Boeing', name: '777-300ER', imageFile: './planes/777300er.jpg' },
    { man: 'Airbus', name: 'A350-900ULR', imageFile: './planes/a350900ulr.jpg' },
    { man: 'Airbus', name: 'A350-1000', imageFile: './planes/a3501000.webp' },
    { man: 'Boeing', name: '747-8i', imageFile: './planes/7478.jpg' },
    { man: 'Boeing', name: '747SP', imageFile: './planes/747sp.jpg' },
    { man: 'Airbus', name: 'A380-800', imageFile: './planes/a380800.jpg' },
    { man: 'Mitsubishi', name: 'MRJ-90', imageFile: './planes/mej90.jpg' },
    { man: 'BAC', name: '111-200', imageFile: './planes/one200.jpg' },
    { man: 'BAC', name: '111-500', imageFile: './planes/one500.jpg' },
    { man: 'Hawker Siddeley', name: 'Trident 1E', imageFile: './planes/trident1e.jpg' },
    { man: 'Hawker Siddeley', name: 'Trident 3B', imageFile: './planes/trident3b.jpg' },
    { man: 'Yakovlev', name: 'MC-21-300', imageFile: './planes/mc21300.jpg' },
    { man: 'Yakovlev', name: 'MC-21-310', imageFile: './planes/mc21310.jpg' },
    { man: 'Convair', name: 'CV-990', imageFile: './planes/990.jpg' },
]

module.exports = {
    name: 'planespotting',
    description: 'Guess the plane from the given image',
    async execute(message, args) {
        if (!args.length) {
            const randomPlane = planes[Math.floor(Math.random() * planes.length)];

            const attachment = new AttachmentBuilder(randomPlane.imageFile);

            const msg1 = await message.reply({ content: 'Guess the plane!', files: [attachment] });

            const filter = (response) => {
                return response.author.id === message.author.id;
            };

            const timeLimit = 30000; 
            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
                .then((collected) => {
                    const syRT = /[- ]/g;
                    const guess1 = collected.first().content.trim().toLowerCase();
                    const correctAnswer1 = randomPlane.name.toLowerCase();
                    const guess = guess1.replace(syRT, '');
                    const correctAnswer = correctAnswer1.replace(syRT, '');
                    const correctUCAnswer = randomPlane.name
                    const correctMan = randomPlane.man;

                    if (guess.includes('|||')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes('http')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes(correctAnswer)) {
                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer}.`);
                    } 
                    else {
                        msg1.reply(`Incorrect. The correct answer is the ${correctMan} ${correctUCAnswer}.`);
                    }
                })
                .catch(() => {
                    msg1.reply('Time\'s up! No guess was given.');
            }); 
        }

        const call1 = args[0]
        const call = call1.toLowerCase();

        if (call === 'normal') {
            const randomPlane = planes[Math.floor(Math.random() * planes.length)];

            const attachment = new AttachmentBuilder(randomPlane.imageFile);

            const msg1 = await message.reply({ content: 'Guess the plane!', files: [attachment] });

            const filter = (response) => {
                return response.author.id === message.author.id;
            };

            const timeLimit = 30000; 
            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
                .then((collected) => {
                    const syRT = /[- ]/g;
                    const guess1 = collected.first().content.trim().toLowerCase();
                    const correctAnswer1 = randomPlane.name.toLowerCase();
                    const guess = guess1.replace(syRT, '');
                    const correctAnswer = correctAnswer1.replace(syRT, '');
                    const correctUCAnswer = randomPlane.name
                    const correctMan = randomPlane.man;

                    if (guess.includes('|||')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes('http')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes(correctAnswer)) {
                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer}.`);
                    } 
                    else {
                        msg1.reply(`Incorrect. The correct answer is the ${correctMan} ${correctUCAnswer}.`);
                    }
                })
                .catch(() => {
                    msg1.reply('Time\'s up! No guess was given.');
            }); 
        }

        if (call === 'hard') {
            const randomPlane = cool[Math.floor(Math.random() * cool.length)];

            const attachment = new AttachmentBuilder(randomPlane.imageFile);

            const msg1 = await message.reply({ content: 'Guess the plane!', files: [attachment] });

            const filter = (response) => {
                return response.author.id === message.author.id;
            };

            const timeLimit = 30000; 
            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
                .then((collected) => {
                    const syRT = /[- ]/g;
                    const guess1 = collected.first().content.trim().toLowerCase();
                    const correctAnswer1 = randomPlane.name.toLowerCase();
                    const guess = guess1.replace(syRT, '');
                    const correctAnswer = correctAnswer1.replace(syRT, '');
                    const correctUCAnswer = randomPlane.name
                    const correctMan = randomPlane.man;

                    if (guess.includes('|||')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes('http')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes(correctAnswer)) {
                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer}.`);
                    } 
                    else {
                        msg1.reply(`Incorrect. The correct answer is the ${correctMan} ${correctUCAnswer}.`);
                    }
                })
                .catch(() => {
                    msg1.reply('Time\'s up! No guess was given.');
            }); 
        }

        if (call === 'oldhard') {
            const randomPlane = hardplanes[Math.floor(Math.random() * hardplanes.length)];

            const attachment = new AttachmentBuilder(randomPlane.imageFile);

            const msg1 = await message.reply({ content: 'Guess the plane!', files: [attachment] });

            const filter = (response) => {
                return response.author.id === message.author.id;
            };

            const timeLimit = 30000; 
            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
                .then((collected) => {
                    const syRT = /[- ]/g;
                    const guess1 = collected.first().content.trim().toLowerCase();
                    const correctAnswer1 = randomPlane.name.toLowerCase();
                    const guess = guess1.replace(syRT, '');
                    const correctAnswer = correctAnswer1.replace(syRT, '');
                    const correctUCAnswer = randomPlane.name
                    const correctMan = randomPlane.man;

                    if (guess.includes('|||')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes('http')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes(correctAnswer)) {
                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer}.`);
                    } 
                    else {
                        msg1.reply(`Incorrect. The correct answer is the ${correctMan} ${correctUCAnswer}.`);
                    }
                })
                .catch(() => {
                    msg1.reply('Time\'s up! No guess was given.');
            }); 
        }

        if (call === 'crazy') {
            const randomPlane = planes2[Math.floor(Math.random() * planes2.length)];

            const attachment = new AttachmentBuilder(randomPlane.imageFile);

            const msg1 = await message.reply({ content: 'Guess the plane!', files: [attachment] });

            const filter = (response) => {
                return response.author.id === message.author.id;
            };

            const timeLimit = 30000; 
            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
                .then((collected) => {
                    const syRT = /[- ]/g;
                    const guess1 = collected.first().content.trim().toLowerCase();
                    const correctAnswer1 = randomPlane.name.toLowerCase();
                    const guess = guess1.replace(syRT, '');
                    const correctAnswer = correctAnswer1.replace(syRT, '');
                    const correctUCAnswer = randomPlane.name
                    const correctMan = randomPlane.man;

                    if (guess.includes('|||')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes('http')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes(correctAnswer)) {
                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer}.`);
                    } 
                    else {
                        msg1.reply(`Incorrect. The correct answer is the ${correctMan} ${correctUCAnswer}.`);
                    }
                })
                .catch(() => {
                    msg1.reply('Time\'s up! No guess was given.');
                });
        }

        if (call === 'military') {
            const randomPlane = military[Math.floor(Math.random() * military.length)];

            const attachment = new AttachmentBuilder(randomPlane.imageFile);

            const msg1 = await message.reply({ content: 'Guess the plane!', files: [attachment] });

            const filter = (response) => {
                return response.author.id === message.author.id;
            };

            const timeLimit = 30000; 
            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
                .then((collected) => {
                    const syRT = /[- ]/g;
                    const guess1 = collected.first().content.trim().toLowerCase();
                    const correctAnswer1 = randomPlane.name.toLowerCase();
                    const alternateAnswer1 = randomPlane.alt.toLowerCase();
                    const guess = guess1.replace(syRT, '');
                    const correctAnswer = correctAnswer1.replace(syRT, '');
                    const alternateAnswer = alternateAnswer1.replace(syRT, '');
                    const correctUCAnswer = randomPlane.name
                    const correctMan = randomPlane.man;
                    const correctAlt = randomPlane.alt;

                    if (guess.includes('|||')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes('http')) {
                        msg1.reply(`Nice try...`)
                        return
                    }

                    if (guess.includes(correctAnswer)) {
                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer} ${correctAlt}.`);
                    } 
                    else if (guess.includes(alternateAnswer)) {
                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer} ${correctAlt}.`);
                    }
                    else {
                        msg1.reply(`Incorrect. The correct answer is the ${correctMan} ${correctUCAnswer} ${correctAlt}.`);
                    }
                })
                .catch(() => {
                    msg1.reply('Time\'s up! No guess was given.');
                });
        }

//        if (call === 'combined') {
//            const randomPlane = combined[Math.floor(Math.random() * combined.length)];
//
//            const attachment = new AttachmentBuilder(randomPlane.imageFile);
//
//            message.reply({ content: 'Guess the plane!', files: [attachment] });
//
//            const filter = (response) => {
//                return response.author.id === message.author.id;
//            };
//
//            const timeLimit = 30000; 
//            message.channel.awaitMessages({ filter, max: 1, time: timeLimit, errors: ['time'] })
//                .then((collected) => {
//                    const syRT = /[- ]/g;
//                    const guess1 = collected.first().content.trim().toLowerCase();
//                    const correctAnswer1 = randomPlane.name.toLowerCase();
//                    const guess = guess1.replace(syRT, '');
//                    const correctAnswer = correctAnswer1.replace(syRT, '');
//                    const correctUCAnswer = randomPlane.name
//                    const correctMan = randomPlane.man;
//
//                    if (guess.includes('|||')) {
//                        msg1.reply(`Nice try...`)
//                        return
//                    }
//
//                    if (guess.includes('http')) {
//                        msg1.reply(`Nice try...`)
//                        return
//                    }
//
//                    if (guess.includes(correctAnswer)) {
//                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer}.`);
//                    } 
//                    else if (guess.includes(alternateAnswer)) {
//                        msg1.reply(`Correct! The plane is the ${correctMan} ${correctUCAnswer}.`);
//                    }
//                    else {
//                        msg1.reply(`Incorrect. The correct answer is the ${correctMan} ${correctUCAnswer}.`);
//                    }
//                })
//                .catch(() => {
//                    msg1.reply('Time\'s up! No guess was given.');
//                });
//        }
        
    }
}
