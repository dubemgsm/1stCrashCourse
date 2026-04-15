import csv
import json
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371
    return c * r

# 1. Load the flood data
floods = []
with open('sweden_floods.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        floods.append({"lat": float(row['lat']), "lon": float(row['long']), "id": row['ID']})

# 2. Load the health site data (Simulated and Manual)
with open('nearby_health_sites.json', 'r') as f:
    health_sites = json.load(f)

# 3. Check distance for each site against each flood (10km threshold)
at_risk_sites = []
threshold_km = 10.0 

print(f"Checking {len(health_sites)} health sites against {len(floods)} flood events...")

for site in health_sites:
    is_at_risk = False
    nearby_floods = []
    
    for flood in floods:
        distance = haversine(site['lon'], site['lat'], flood['lon'], flood['lat'])
        if distance <= threshold_km:
            is_at_risk = True
            nearby_floods.append({
                "flood_id": flood['id'],
                "distance_km": round(distance, 3)
            })
    
    if is_at_risk:
        site['risk_info'] = nearby_floods
        at_risk_sites.append(site)

# 4. Save only the at-risk sites to a smaller dataset
with open('at_risk_health_sites.json', 'w') as f:
    json.dump(at_risk_sites, f, indent=4)

print(f"Done! Found {len(at_risk_sites)} sites within 10km of a flood.")
print(f"The smaller dataset has been saved to at_risk_health_sites.json")
