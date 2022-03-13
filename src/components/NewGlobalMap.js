import { Container } from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import worldMill from "../data/worldMill.json";
import { VectorMap } from "@react-jvectormap/core";
// import "./GlobalMap.css";

const handleClick = (e, countryCode) => {
  console.log(countryCode);
};

const GlobalMap = ({ teachers }) => {
  const [countriesData, setContriesData] = useState({});
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef();
  useEffect(() => {
    // Filter teacher using country
    const countriesTeachers = teachers.reduce((acc, teacher) => {
      let countryCode = teacher.location.country_short;

      if (countryCode in acc) {
        acc[countryCode] += 1;
      } else {
        acc[countryCode] = 1;
      }
      return acc;
    }, {});
    setContriesData(countriesTeachers);
    setMarkers([
      ...new Map(
        teachers
          .map((teacher) => {
            return {
              country: teacher.location.country,
              name: teacher.location.country,
              latLng: teacher.location.latLng,
              teacherCount: countriesTeachers[teacher.location.country_short],
            };
          })
          .map((item) => [item["name"], item])
      ).values(),
    ]);
  }, [teachers]);

  console.log("markers", countriesData);

  return (
    <Container>
      {markers.length > 0 && (
        <VectorMap
          mapRef={mapRef}
          map={worldMill}
          backgroundColor="transparent"
          zoomOnScroll={false}
          onRegionClick={handleClick}
          style={{ height: "100vh", width: "100%" }}
          regionStyle={{
            initial: {
              fill: "#e4e4e4",
              fillOpacity: 0.9,
              stroke: "none",
              strokeWidth: 0,
              strokeOpacity: 0,
              cursor: "pointer",
            },
            hover: {
              fillOpacity: 0.8,
              cursor: "pointer",
            },
            selected: {
              fill: "#212121",
              stroke: "#212121",
              strokeWidth: 1,
            },
            selectedHover: {
              fillOpacity: 0.8,
            },
          }}
          markerStyle={{
            initial: {
              fill: "#F8E23B",
              stroke: "#383f47",
            },
          }}
          regionsSelectable={true}
          markers={markers}
          onMarkerTipShow={(e, label, index) => {
            label.html(
              `<div class='marker-tip'>${markers[index].country} ${markers[index].teacherCount}</div>`
            );
          }}
          series={{
            markers: [
              {
                attribute: "r",
                scale: [3, 10],
                values: [...markers.map((teacher) => teacher.teacherCount)],
              },
            ],
            regions: [
              {
                attribute: "fill",
                values: countriesData,

                scale: ["#E5D1F9", "#5606A5"],
                min: 1,
                max: 300,
              },
            ],
          }}
        />
      )}
    </Container>
  );
};

export default GlobalMap;