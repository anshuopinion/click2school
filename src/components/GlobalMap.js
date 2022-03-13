import { Container, Heading } from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { VectorMap } from "react-jvectormap";

// import "./GlobalMap.css";

const handleClick = (e, countryCode) => {
  console.log(countryCode);
};

const GlobalMap = ({ teachers }) => {
  const [countriesData, setContriesData] = useState({});
  const mapRef = useRef();
  useEffect(() => {
    // Filter teacher using country
    const countriesTeachers = teachers.reduce((acc, teacher) => {
      let countryCode = teacher.location.country_short;

      if (countryCode in acc) {
        console.log(countryCode);
        acc[countryCode] += 1;
      } else {
        acc[countryCode] = 1;
      }
      return acc;
    }, {});

    setContriesData(countriesTeachers);
  }, [teachers]);

  const markers = [
    ...new Map(
      teachers
        .map((teacher) => {
          return {
            country: teacher.location.country,
            name: teacher.location.country_short,
            latLng: teacher.location.latLng,
            teacherCount: countriesData[teacher.location.country_short],
          };
        })
        .map((item) => [item["name"], item])
    ).values(),
  ];

  console.log({ countriesData, markers });

  return (
    <Container maxW="container.xl" height="100vh">
      <Heading>Teacher Country Data</Heading>

      <VectorMap
        mapRef={mapRef}
        map={"world_mill"}
        backgroundColor="transparent"
        zoomOnScroll={false}
        onRegionClick={handleClick}
        containerClassName="map"
        regionStyle={{
          initial: {
            fill: "#e4e4e4",
            "fill-opacity": 0.9,
            stroke: "none",
            "stroke-width": 0,
            "stroke-opacity": 0,
            cursor: "pointer",
          },
          hover: {
            fillOpacity: 0.8,
            cursor: "pointer",
          },
          selected: {
            fill: "#212121",
            stroke: "#212121",
            "stroke-width": 1,
          },
          selectedHover: {
            "fill-opacity": 0.8,
          },
        }}
        regionsSelectable={true}
        markers={markers}
        onMarkerTipShow={(e, label, index) => {
          label.html(
            `<div class='marker-tip'>${markers[index].country} ${markers[index].teacherCount}</div>`
          );
        }}
        markerStyle={{
          initial: {
            fill: "#F8E23B",
            stroke: "#383f47",
          },
        }}
        series={{
          markers: [
            {
              attribute: "r",
              scale: [5, 10],
              values: [...markers.map((teacher) => teacher.teacherCount)],
              normalizeFunction: "polynomial",
            },
          ],
          regions: [
            {
              values: countriesData,
              scale: ["#E5D1F9", "#5606A5"],
              normalizeFunction: "polynomial",
              min: 1,
              max: 1000,
            },
          ],
        }}
      />
    </Container>
  );
};

export default GlobalMap;
